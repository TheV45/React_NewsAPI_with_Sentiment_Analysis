import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, Container } from '@mui/material';
import NewsItem from './NewsItem';
import Spinner from './Spinner';

function News({ category, country, apiKey }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    axios
      .get(`https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}`)
      .then((response) => {
        console.log(response);
        
        setArticles(response.data.articles);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching news:', error);
        setLoading(false);
      });
  }, [category, country, apiKey]);

  if (loading) return <Spinner />;

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4 }}>
      <Grid container spacing={4}>
        {articles.map((article) => (
          <Grid item xs={12} sm={6} md={4} key={article.url}>
            <NewsItem article={article} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default News;
