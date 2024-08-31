import React, { useState, useEffect } from 'react';
import Navbar from './Components/Navbar';
import FilterBar from './Components/FilterBar';
import NewsItem from './Components/NewsItem';
import { Container, Grid } from '@mui/material';
import axios from 'axios';

function App() {
  const [category, setCategory] = useState('business');
  const [country, setCountry] = useState('us');
  const [showStarred, setShowStarred] = useState(false);
  const [articles, setArticles] = useState([]);
  const [starredArticles, setStarredArticles] = useState([]);
  const apiKey = '39dfe2d58e6142bc8946d9023d66bd6d';

  useEffect(() => {
    // Fetch the list of starred articles from the backend when component mounts
    axios
      .get('/starred-news')
      .then((response) => {
        setStarredArticles(response.data);
      })
      .catch((error) => {
        console.error('Error fetching starred news:', error);
      });
  }, []);

  useEffect(() => {
    if (showStarred) {
      fetchStarredArticles();
    } else {
      fetchArticles();
    }
  }, [category, country, showStarred]);

  const fetchArticles = () => {
    axios
      .get(`https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}`)
      .then((response) => {
        setArticles(response.data.articles);
      })
      .catch((error) => {
        console.error('Error fetching news:', error);
      });
  };

  const fetchStarredArticles = () => {
    axios
      .get('/starred-news')
      .then((response) => {
        setStarredArticles(response.data);
      })
      .catch((error) => {
        console.error('Error fetching starred news:', error);
      });
  };

  const toggleView = () => {
    setShowStarred((prevShowStarred) => !prevShowStarred);
  };

  const handleStarToggle = (article) => {
    if (starredArticles.some(starred => starred.url === article.url)) {
      axios.delete('/unstar-news', { data: { url: article.url } })
        .then(() => {
          setStarredArticles(prevArticles => prevArticles.filter(item => item.url !== article.url));
        })
        .catch((error) => {
          console.error('Error removing starred news:', error);
        });
    } else {
      axios.post('/star-news', article)
        .then((response) => {
          setStarredArticles(prevArticles => [...prevArticles, response.data]);
        })
        .catch((error) => {
          console.error('Error adding starred news:', error);
        });
    }
  };

  const isArticleStarred = (article) => {
    return starredArticles.some(starred => starred.url === article.url);
  };

  return (
    <>
      <Navbar buttonLabel={showStarred ? 'Home' : 'Starred News'} toggleView={toggleView} />
      {!showStarred && <FilterBar setCategory={setCategory} setCountry={setCountry} />}
      <Container maxWidth="lg" sx={{ marginTop: 4 }}>
        {showStarred ? (
          <Grid container spacing={4}>
            {starredArticles.map((article) => (
              <Grid item xs={12} sm={6} md={4} key={article.url}>
                <NewsItem article={article} isStarred={true} handleStarToggle={handleStarToggle} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid container spacing={4}>
            {articles.map((article) => (
              <Grid item xs={12} sm={6} md={4} key={article.url}>
                <NewsItem
                  article={article}
                  isStarred={isArticleStarred(article)}
                  handleStarToggle={handleStarToggle}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
}

export default App;
