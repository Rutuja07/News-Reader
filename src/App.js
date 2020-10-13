import React, { useState, useEffect } from 'react';
import { Typography } from '@material-ui/core';
import wordsToNumbers from 'words-to-numbers';
import alanBtn from '@alan-ai/alan-sdk-web';
import  {useDarkMode} from "./components/useDarkMode"
import {ThemeProvider} from "styled-components";
import { GlobalStyles } from "./components/GlobalStyles";
import { lightTheme, darkTheme } from "./components/Themes"
import Toggle from "./components/Toggler"
import { NewsCards, Modal } from './components';
import useStyles from './styles';



const App = () => {


  const [activeArticle, setActiveArticle] = useState(0);
  const [newsArticles, setNewsArticles] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  
  
  const [theme, themeToggler, mountedComponent] = useDarkMode();

  const themeMode = theme === 'light' ? lightTheme : darkTheme;
  const classes = useStyles();
  useEffect(() => {
    alanBtn({
      key: '8f0e35803ec6cbbef08905a976c05f0d2e956eca572e1d8b807a3e2338fdd0dc/stage',
      onCommand: ({ command, articles, number }) => {
        if (command === 'newHeadlines') {
          setNewsArticles(articles);
          setActiveArticle(-1);
        } else if (command === 'instructions') {
          setIsOpen(true);
        } else if (command === 'highlight') {
          setActiveArticle((prevActiveArticle) => prevActiveArticle + 1);
        } else if (command === 'open') {
          const parsedNumber = number.length > 2 ? wordsToNumbers((number), { fuzzy: true }) : number;
          const article = articles[parsedNumber - 1];

          if (parsedNumber > articles.length) {
            alanBtn().playText('Please try that again...');
          } else if (article) {
            window.open(article.url, '_blank');
            alanBtn().playText('Opening...');
          } else {
            alanBtn().playText('Please try that again...');
          }
        }
      },
    });
  }, []);
  if(!mountedComponent) return <div/>
  return (
    <ThemeProvider theme={themeMode}>
    <>
    <GlobalStyles/>
    <div className ="App">
    <Toggle theme={theme} toggleTheme={themeToggler} />
    <div>
      <div className={classes.logoContainer} >
        {newsArticles.length ? (
          <div className={classes.infoContainer}>
            <div className={classes.card}><Typography variant="h5" component="h2">Try saying: <br /><br />Open article number [4]</Typography></div>
            <div className={classes.card}><Typography variant="h5" component="h2">Try saying: <br /><br />Go back</Typography></div>
          </div>
        ) : null}
        <img src="https://w7.pngwing.com/pngs/621/840/png-transparent-newspaper-computer-icons-breaking-news-gatekeeping-newspaper-design-thumbnail.png" className={classes.alanLogo} alt="logo" />
        
      </div>
     
      <NewsCards articles={newsArticles} activeArticle={activeArticle} />
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} />
      {!newsArticles.length ? (
        <div className={classes.footer}>
          <Typography variant="body1" component="h2">
        
           
          </Typography>
         {/* <div className={dark ? "App dark-mode":"App"}> 
         <div className="nav"> 
         <label className="switch">
             <input type="checkbox"
             onChange={()=>setMode( dark)}
             />
         <span className="slider round"></span>
             </label>
             </div>
         </div> */}
         {/* <button onClick={themeToggler}>Switch Theme</button> */}
        </div>
      ) : null}
    </div>
    </div>
    </>
    
    </ThemeProvider>
  );
};

export default App;
