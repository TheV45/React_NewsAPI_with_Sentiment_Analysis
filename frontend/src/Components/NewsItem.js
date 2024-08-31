import React, { useState } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardMedia, CardContent, CardActions, IconButton, Typography, Avatar, Button, Box, Modal, CircularProgress, Snackbar, Alert, Menu, MenuItem } from '@mui/material';
import { Favorite, Share, Close } from '@mui/icons-material';
import { pink } from '@mui/material/colors';
import { styled } from '@mui/material/styles';

// List of colors for the Avatar
const avatarColors = ['red', 'blue', 'green', 'purple', 'orange', 'cyan', 'teal', 'brown'];

/**
 * Function to generate a random color for the Avatar.
 * @returns {string} Random color string from the list.
 */
const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * avatarColors.length);
  return avatarColors[randomIndex];
};

// Styled component to highlight sentiment words
const HighlightedText = styled('span')(({ sentiment }) => ({
  backgroundColor: sentiment === 'positive' ? 'green' : sentiment === 'neutral' ? 'orange' : 'red',
  color: 'white',
  padding: '2px 4px',
  borderRadius: '4px',
}));

/**
 * NewsItem component renders individual news article card with Material-UI styling.
 * @param {Object} article - Article data to be displayed.
 * @param {boolean} isStarred - Whether the article is starred.
 * @param {Function} handleStarToggle - Function to add or remove the article from starred news.
 */
function NewsItem({ article, isStarred, handleStarToggle }) {
  const [avatarColor] = useState(getRandomColor()); // Generate random color once when component mounts
  const [open, setOpen] = useState(false); // State to control modal
  const [sentiment, setSentiment] = useState(''); // State to hold sentiment analysis
  const [loading, setLoading] = useState(false); // Loading state for fetching sentiment analysis
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State to control snackbar visibility
  const [snackbarMessage, setSnackbarMessage] = useState(''); // State to hold snackbar message
  const [anchorEl, setAnchorEl] = useState(null); // State to control menu anchor

  /**
   * Formats date string to 'MM/DD/YYYY' format.
   * @param {string} dateString - ISO date string.
   * @returns {string} Formatted date.
   */
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const handleStarClick = () => {
    handleStarToggle(article);
    setSnackbarMessage(isStarred ? 'Removed from Liked News' : 'Added to Liked News');
    setSnackbarOpen(true); // Open snackbar
  };

  const handleAnalyzeSentimentClick = () => {
    setLoading(true);
    setOpen(true);

    // Fetch sentiment analysis from the backend
    axios.post('/analyze-sentiment', { headline: article.title })
      .then((response) => {
        setSentiment(response.data.sentiment);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching sentiment analysis:', error);
        setLoading(false);
      });
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false); // Close snackbar
  };

  const handleCloseModal = () => {
    setOpen(false); // Close modal
  };

  const handleShareClick = (event) => {
    setAnchorEl(event.currentTarget); // Open menu
  };

  const handleCloseMenu = () => {
    setAnchorEl(null); // Close menu
  };

  // Function to render sentiment with highlighted text
  const renderSentimentWithHighlight = (text) => {
    const sentimentWords = ['positive', 'neutral', 'negative'];
    const parts = text.split(new RegExp(`(${sentimentWords.join('|')})`, 'gi'));

    return parts.map((part, index) =>
      sentimentWords.includes(part.toLowerCase()) ? (
        <HighlightedText key={index} sentiment={part.toLowerCase()}>
          {part}
        </HighlightedText>
      ) : (
        part
      )
    );
  };

  return (
    <>
      <Card sx={{ maxWidth: 345, margin: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: avatarColor }} aria-label="recipe">
              {article.author ? article.author.charAt(0) : 'A'}
            </Avatar>
          }
          title={article.author || "Unknown Author"}
          subheader={formatDate(article.publishedAt)}
        />
        <CardMedia
          component="img"
          height="194"
          image={article.urlToImage ? article.urlToImage : 'placeholder-image-url.jpg'}
          alt={article.title}
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {article.title}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton
            aria-label="add to favorites"
            onClick={handleStarClick}
            sx={{ color: isStarred ? pink[500] : 'inherit' }} // Use prop to set color
          >
            <Favorite />
          </IconButton>
          <IconButton aria-label="share" onClick={handleShareClick}>
            <Share />
          </IconButton>
          <Button
            size="small"
            color="primary"
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Read More
          </Button>
          <Button
            size="small"
            color="secondary"
            onClick={handleAnalyzeSentimentClick}  // Handle click for sentiment analysis
          >
            Analyze Sentiment
          </Button>
        </CardActions>

        {/* Menu for sharing options */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
        >
          <MenuItem onClick={handleCloseMenu}>
            <a
              className="twitter-share-button"
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(article.url)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              Share on Twitter
            </a>
          </MenuItem>
          <MenuItem onClick={handleCloseMenu}>
            <a
              className="fb-share-button"
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(article.url)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              Share on Facebook
            </a>
          </MenuItem>
        </Menu>

        {/* Modal for displaying sentiment analysis */}
        <Modal
          open={open}
          onClose={handleCloseModal}
          aria-labelledby="sentiment-modal-title"
          aria-describedby="sentiment-modal-description"
        >
          <Box sx={{ width: 400, bgcolor: 'background.paper', margin: 'auto', marginTop: '10%', padding: 4, borderRadius: 1, position: 'relative' }}>
            <IconButton
              aria-label="close"
              onClick={handleCloseModal}
              sx={{ position: 'absolute', top: 8, right: 8 }}
            >
              <Close />
            </IconButton>
            {loading ? (
              <CircularProgress />
            ) : (
              <>
                <Typography id="sentiment-modal-title" variant="h6" component="h2">
                  Sentiment Analysis
                </Typography>
                <Typography id="sentiment-modal-description" sx={{ mt: 2 }}>
                  {renderSentimentWithHighlight(sentiment)}
                </Typography>
              </>
            )}
          </Box>
        </Modal>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity="info" sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Card>
    </>
  );
}

export default NewsItem;
