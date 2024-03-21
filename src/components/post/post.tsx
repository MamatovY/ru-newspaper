import { useParams } from 'react-router-dom';
import styles from './post.module.scss';
import { useEffect, useState } from 'react';
import { Post } from 'types';

const ThePost = () => {
    // Состояние для хранения данных о посте
    const [post, setPost] = useState<Post | null>(null);
    // Получаем параметр id из URL
    const { id } = useParams();

    // Функция для загрузки данных о посте по его id
    const fetchPosts = async (id: string) => {
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
            const data: Post = await response.json();

            // Обновляем состояние с данными о посте
            setPost(data);
        } catch (error) {
            console.error('Ошибка при получении поста:', error);
        }
    };

    // Загружаем данные о посте при монтировании компонента и при изменении id в URL
    useEffect(() => {
        if (id) {
            fetchPosts(id);
        }
    }, [id]);

    // Отображаем данные о посте, если они загружены
    return post && (
        <div className={styles.post}>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
            <p>{post.id}</p>
        </div>
    );
}

export default ThePost;
