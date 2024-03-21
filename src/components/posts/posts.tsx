import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import styles from './posts.module.scss';
import { Post } from 'types';



const ThePosts: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  let initialPage = parseInt(searchParams.get('page') || '1', 10);
  const initialLimit = initialPage * 10
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(initialLimit);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loadedPages, setLoadedPages] = useState<number>(0);

  useEffect(() => {
    fetchPosts(page, limit)
  }, [page])


  const fetchPosts = async (pageParam: number, limit: number) => {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_page=${pageParam}&_limit=${limit}`);
      const data: Post[] = await response.json();
      setPosts([...posts, ...data]);
      setLoading(false);
      setLimit(10)

      if (data.length === 0) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Ошибка при получении постов:', error);
    }
  };

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loading) return;
    if (!hasMore) return;
    if (loadedPages < 5) {
      setPage(initialPage + 1);

      const newSearchParams = new URLSearchParams(location.search);
      newSearchParams.set('page', String(initialPage + 1));
      navigate(`?${newSearchParams.toString()}`, { replace: true });

      setLoadedPages(prevLoadedPages => prevLoadedPages + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, loadedPages]);

  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.set('page', String(page + 1));
    navigate(`?${newSearchParams.toString()}`, { replace: true });
  };

  return (
    <>
      <div className={styles.posts}>
        {posts.map(post => (
          <Link to={`/posts/${post.id}`} key={post.id} className={styles.post}>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
            <p>{post.id}</p>
          </Link>
        ))}
      </div>
      {loading && <p>Loading...</p>}
      {!loading && hasMore && loadedPages >= 5 && <button onClick={loadMore}>Load More</button>}
    </>
  );
};

export default ThePosts