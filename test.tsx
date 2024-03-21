import React, { useState, useEffect } from 'react';
import styles from './PostList.module.css';

// Интерфейс для описания структуры поста
interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

// Основной компонент для отображения списка постов
const PostList: React.FC = () => {
  // Состояния для хранения постов, состояния загрузки и текущей страницы
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // Функция для запроса постов с сервера
  const fetchPosts = async () => {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=10`);
      const data: Post[] = await response.json();
      setPosts(prevPosts => [...prevPosts, ...data]);
      setLoading(false);
      if (data.length === 0) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  // Функция для обработки скролла страницы
  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loading) return;
    if (!hasMore) return;
    setPage(prevPage => prevPage + 1);
  };

  // Эффект для добавления обработчика скролла при монтировании компонента и его очистки при размонтировании
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  // Эффект для запроса постов при изменении номера страницы
  useEffect(() => {
    fetchPosts();
  }, [page]);

  // Функция для загрузки следующей порции постов по кнопке "Загрузить еще"
  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  // Обработчик клика по посту
  const handleClick = (postId: number) => {
    // Здесь можете добавить переход на отдельную страницу поста
    console.log('Clicked post with id:', postId);
  };

  // Возвращаем JSX с отображением списка постов и кнопки "Загрузить еще"
  return (
    <div className={styles.postList}>
      {posts.map(post => (
        <div key={post.id} className={styles.post} onClick={() => handleClick(post.id)}>
          <h2>{post.title}</h2>
          <p>{post.body}</p>
        </div>
      ))}
      {loading && <p>Loading...</p>}
      {!loading && hasMore && <button onClick={loadMore}>Load More</button>}
    </div>
  );
};

export default PostList;
