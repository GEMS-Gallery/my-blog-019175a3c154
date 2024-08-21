import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Card, CardContent, Grid } from '@mui/material';
import { styled } from '@mui/system';
import { useForm, Controller } from 'react-hook-form';
import Modal from 'react-modal';
import { backend } from 'declarations/backend';

const HeroSection = styled('div')(({ theme }) => ({
  backgroundImage: 'url(https://loremflickr.com/g/1200/400/crypto?lock=1)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  color: 'white',
  padding: theme.spacing(8),
  marginBottom: theme.spacing(4),
}));

type Post = {
  id: bigint;
  title: string;
  body: string;
  author: string;
  timestamp: bigint;
};

type FormData = {
  title: string;
  body: string;
  author: string;
};

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { control, handleSubmit, reset } = useForm<FormData>();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const fetchedPosts = await backend.getPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      await backend.createPost(data.title, data.body, data.author);
      setIsModalOpen(false);
      reset();
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <Container>
      <HeroSection>
        <Typography variant="h2" component="h1" gutterBottom>
          Crypto Blog
        </Typography>
      </HeroSection>

      <Button
        variant="contained"
        color="primary"
        onClick={() => setIsModalOpen(true)}
        style={{ marginBottom: '20px' }}
      >
        Create New Post
      </Button>

      <Grid container spacing={3}>
        {posts.map((post) => (
          <Grid item xs={12} key={Number(post.id)}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2">
                  {post.title}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  By {post.author} on {new Date(Number(post.timestamp) / 1000000).toLocaleString()}
                </Typography>
                <Typography variant="body2" component="p">
                  {post.body}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Create New Post"
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '400px',
          },
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          Create New Post
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="title"
            control={control}
            defaultValue=""
            rules={{ required: 'Title is required' }}
            render={({ field, fieldState: { error } }) => (
              <>
                <Typography>Title</Typography>
                <input {...field} style={{ width: '100%', marginBottom: '10px' }} />
                {error && <Typography color="error">{error.message}</Typography>}
              </>
            )}
          />
          <Controller
            name="body"
            control={control}
            defaultValue=""
            rules={{ required: 'Body is required' }}
            render={({ field, fieldState: { error } }) => (
              <>
                <Typography>Body</Typography>
                <textarea {...field} style={{ width: '100%', height: '100px', marginBottom: '10px' }} />
                {error && <Typography color="error">{error.message}</Typography>}
              </>
            )}
          />
          <Controller
            name="author"
            control={control}
            defaultValue=""
            rules={{ required: 'Author is required' }}
            render={({ field, fieldState: { error } }) => (
              <>
                <Typography>Author</Typography>
                <input {...field} style={{ width: '100%', marginBottom: '10px' }} />
                {error && <Typography color="error">{error.message}</Typography>}
              </>
            )}
          />
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </form>
      </Modal>
    </Container>
  );
};

export default App;
