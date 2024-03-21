import { useParams } from 'react-router-dom'
import styles from './post.module.scss'
import { useEffect, useState } from 'react'
import { Post } from 'types'




const ThePost = () => {
    const [post, setPost] = useState<Post | null>(null)
    const { id } = useParams()

    const fetchPosts = async (id: string,) => {
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
            const data: Post = await response.json();

            setPost(data);

        } catch (error) {
            console.error('Ошибка при получении поста:', error);
        }
    };

    useEffect(() => {
        if (id)
            fetchPosts(id);
    }, [id]);

    return post && (
        <div className={styles.post}>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
            <p>{post.id}</p>
        </div>
    )
}

export default ThePost