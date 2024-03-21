import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import styles from './posts.module.scss';
import { Post } from 'types';



const ThePosts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loadedPages, setLoadedPages] = useState<number>(0);

  const navigate = useNavigate();
  const location = useLocation();



  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const pageParam = parseInt(searchParams.get('page') || '1', 10);
    let limit = pageParam * 10
    console.log(limit);
    if (pageParam > 1) {
      // setLimit(limit)
      setPage(pageParam)
    }
  }, [])

  useEffect(() => {
    //   const searchParams = new URLSearchParams(location.search);
    //   const pageParam = parseInt(searchParams.get('page') || '1', 10);
    fetchPosts(page, 10)
  }, [page])





  //     const newSearchParams = new URLSearchParams(location.search);
  //     newSearchParams.set('page', String(page));
  //     navigate(`?${newSearchParams.toString()}`, { replace: true });

  console.log(hasMore);


  const fetchPosts = async (pageParam: number, limit: number) => {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_page=${pageParam}&_limit=${limit}`);
      const data: Post[] = await response.json();
      console.log(posts);
      console.log(data);
      setPosts([...posts, ...data]);
      setLoading(false);
      setLimit(10)

      const newSearchParams = new URLSearchParams(location.search);
      newSearchParams.set('page', String(page));
      navigate(`?${newSearchParams.toString()}`, { replace: true });

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
      setPage(prevPage => prevPage + 1);
      setLoadedPages(prevLoadedPages => prevLoadedPages + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, loadedPages]);

  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  console.log(posts);

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