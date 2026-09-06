import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchApi } from '../lib/api';
import PublicLayout from '../components/Layout/PublicLayout';

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const data = await fetchApi(`/posts/${id}`);
        setPost(data);
      } catch (err) {
        setError(err.message || 'Không tìm thấy bài viết');
      } finally {
        setLoading(false);
      }
    };
    loadPost();
  }, [id]);

  let imagesList = [];
  if (post) {
    if (post.images) {
      try {
        imagesList = JSON.parse(post.images);
      } catch (e) { }
    } else if (post.image) {
      imagesList = [post.image];
    }
  }

  return (
    <PublicLayout>
      <div style={{ background: '#f5f7f9', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <main style={{ flex: 1, padding: '40px 0' }}>
          <div className="container">
            <Link to="/" style={{ color: 'var(--green-dark)', textDecoration: 'none', display: 'inline-block', marginBottom: 20 }}>
              &larr; Quay lại trang chủ
            </Link>

            <div style={{ background: '#fff', padding: '40px', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              {loading && <p>Đang tải bài viết...</p>}
              {error && <p style={{ color: 'red' }}>{error}</p>}

              {post && (
                <article>
                  <h1 style={{ color: 'var(--green-dark)', marginBottom: 15, fontSize: 24, lineHeight: 1.4 }}>
                    {post.title}
                  </h1>
                  <div style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 30, paddingBottom: 15, borderBottom: '1px solid #eee' }}>
                    {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                  </div>

                  <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, fontSize: 16, color: '#333' }}>
                    {post.content}
                  </div>

                  {imagesList.length > 0 && (
                    <div style={{
                      marginTop: 24,
                      display: 'grid',
                      gridTemplateColumns: imagesList.length === 1 ? '1fr' : 'repeat(2, 1fr)',
                      gap: 4,
                      borderRadius: 12,
                      overflow: 'hidden',
                      border: '1px solid #e5e7eb'
                    }}>
                      {imagesList.map((img, idx) => {
                        let gridStyle = {};
                        const count = imagesList.length;

                        if (count === 1) {
                          gridStyle = { gridColumn: '1 / -1', maxHeight: 600 };
                        } else if (count === 3 && idx === 0) {
                          gridStyle = { gridColumn: '1 / -1', height: 400 };
                        } else if (count === 3 && idx > 0) {
                          gridStyle = { height: 250 };
                        } else if (count >= 4) {
                          gridStyle = { height: 250 };
                        } else {
                          // count === 2
                          gridStyle = { height: 350 };
                        }

                        return (
                          <div key={idx} style={{
                            position: 'relative',
                            width: '100%',
                            ...gridStyle,
                            overflow: 'hidden'
                          }}>
                            <img
                              src={`/uploads/${img}`}
                              alt={post.title}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: count === 1 ? 'contain' : 'cover',
                                display: 'block',
                                background: '#f0f2f5',
                                transition: 'transform 0.3s ease',
                                cursor: 'pointer'
                              }}
                              onMouseEnter={e => e.currentTarget.style.transform = count === 1 ? 'none' : 'scale(1.02)'}
                              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </article>
              )}
            </div>
          </div>
        </main>
      </div>
    </PublicLayout>
  );
}
