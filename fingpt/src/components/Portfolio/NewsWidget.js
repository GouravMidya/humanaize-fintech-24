import React from 'react';
import { Typography, Card, CardContent, CardMedia, Link, Box } from '@mui/material';

function NewsWidget({ news }) {
  return (
    <Box
      sx={{
        height: '600px', // Adjust this to match the height of your performance chart
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
          width: '0em',
        },
        '&::-webkit-scrollbar-track': {
          boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
          webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0,0,0,.1)',
          outline: '1px solid slategrey',
        },
      }}
    >
      {news.map((item, index) => (
        <Link
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          key={index}
          sx={{
            textDecoration: 'none',
            display: 'block',
            mb: 2,
            '&:last-child': { mb: 0 },
          }}
        >
          <Card
            sx={{
              display: 'flex',
              flexDirection: 'column',
              cursor: 'pointer',
              '&:hover': {
                boxShadow: 6,
              },
            }}
          >
            {item.urlToImage && (
              <CardMedia
                component="img"
                height="240"
                image={item.urlToImage}
                alt={item.title}
              />
            )}
            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Typography
                component="h6"
                variant="subtitle1"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  width: '100%',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  letterSpacing: '-0.5px',
                  textAlign: 'justify',
                  lineHeight: '1.2',
                }}
              >
                {item.title}
              </Typography>
              <Typography variant="caption" display="block" gutterBottom>
                {item.source.name} - {new Date(item.publishedAt).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: '1.2', flex: 1 }}>
                {item.description}
              </Typography>
            </CardContent>
          </Card>
        </Link>
      ))}
    </Box>
  );
}

export default NewsWidget;
