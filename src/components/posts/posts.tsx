import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import styles from './posts.module.scss';
import { Post } from 'types';


const ThePosts: React.FC = () => {
  // Получаем объекты навигации и местоположения из react-router-dom
  const navigate = useNavigate();
  const location = useLocation();
  // Получаем параметры из URL
  const searchParams = new URLSearchParams(location.search);
  // Получаем номер страницы из параметров или устанавливаем значение по умолчанию (1)
  let initialPage = parseInt(searchParams.get('page') || '1', 10);
  // Вычисляем начальное значение лимита на основе номера страницы (для первой страницы устанавливаем 10, для последующих - page * 10)
  const initialLimit = initialPage === 1 ? 10 : initialPage * 10;

  // Список постов
  const [posts, setPosts] = useState<Post[]>([]);
  // Флаг загрузки данных
  const [loading, setLoading] = useState<boolean>(true);
  // Номер текущей страницы
  const [page, setPage] = useState<number>(1);
  // Лимит на запрос к бекенду
  const [limit, setLimit] = useState<number>(initialLimit);
  // Флаг чтобы узнать есть ли еше данные
  const [hasMore, setHasMore] = useState<boolean>(true);
  // Счетчик автоматически загруженных страниц
  const [loadedPages, setLoadedPages] = useState<number>(0);

  // Запрос постов при загрузке компонента и при изменении номера страницы
  useEffect(() => {
    fetchPosts(page, limit);
  }, [page]);

  // Функция для запроса постов с сервера
  const fetchPosts = async (pageParam: number, limit: number) => {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_page=${pageParam}&_limit=${limit}`);
      const data: Post[] = await response.json();
      // Обновляем состояния
      setPosts([...posts, ...data]);

      // Устанавливаем флаг загрузки данных в значение false после успешной загрузки
      setLoading(false);

      // Устанавливаем лимит на количество элементов на странице в 10 после каждой загрузки
      setLimit(10);

      // Проверяем, есть ли еще данные для загрузки
      // Если длина полученного массива данных равна 0, значит, больше нет данных для загрузки
      if (data.length === 0) {
        // Устанавливаем флаг hasMore в значение false, чтобы скрыть кнопку "Load More"
        setHasMore(false);
      }

    } catch (error) {
      console.error('Ошибка при получении постов:', error);
    }
  };

  // Обработчик скролла страницы для автоматической подгрузки постов
  const handleScroll = () => {
    // Проверяем, доскроллен ли пользователь до конца страницы, и нет ли загрузки в процессе
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loading) return;
    // Проверяем, есть ли еще данные для загрузки и не превышено ли ограничение по числу загруженных страниц (5 раз)
    if (!hasMore || loadedPages >= 5) return;
    // Увеличиваем номер страницы, обновляем URL с новыми параметрами и обновляем счетчик загруженных страниц
    setPage(initialPage + 1);
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.set('page', String(initialPage + 1));
    navigate(`?${newSearchParams.toString()}`, { replace: true });
    setLoadedPages(prevLoadedPages => prevLoadedPages + 1);
  };

  // Добавляем обработчик скролла при монтировании компонента и убираем его при размонтировании
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, loadedPages]);

  // Функция для загрузки следующей порции постов по кнопке "Load More"
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
      {/* Отображаем загрузчик, если данные загружаются */}
      {loading && <p>Loading...</p>}
      {/* Отображаем кнопку "Load More" только если есть еще данные для загрузки и не превышено ограничение по числу автоматически загруженных страниц (5 раз) */}
      {!loading && hasMore && loadedPages >= 5 && <button onClick={loadMore}>Load More</button>}
    </>
  );
};

export default ThePosts;
