import React from 'react';
import { Typography, Card, CardContent, CardMedia, Link } from '@mui/material';

function NewsWidget({ news }) {
  return (
    <>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Financial News
      </Typography>
      {news.map((item, index) => (
        <Link 
          key={index} 
          href={item.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          underline="none"
          sx={{ textDecoration: 'none', display: 'flex', mb: 2 }}
        >
          <Card sx={{ display: 'flex', mb: 2, height: 'auto' }}>
            <CardMedia
              component="img"
              sx={{ width: 150, height: '100%', objectFit: 'cover' }}
              image={item.urlToImage || 'https://via.placeholder.com/150'}
              alt={item.title}
            />
            <CardContent sx={{ flex: 'auto', overflow: 'hidden' }}>
              <Typography 
                component="h5" 
                variant="subtitle1" 
                sx={{ 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis',
                  width: '100%' 
                }}
              >
                {item.title}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{textOverflow: 'ellipsis'}}>
                {item.source.name} - {new Date(item.publishedAt).toLocaleDateString()}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  mt: 1, 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis', 
                  display: '-webkit-box', 
                  WebkitLineClamp: 3, 
                  WebkitBoxOrient: 'vertical' 
                }}
              >
                {item.description}
              </Typography>
            </CardContent>
          </Card>
        </Link>
      ))}
    </>
  );
}

export default NewsWidget;
