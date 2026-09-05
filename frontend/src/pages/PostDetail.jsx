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
                    <div style={{ marginTop: 40 }}>
                      <h3 style={{ marginBottom: 20, fontSize: 18, color: 'var(--green-dark)', borderBottom: '2px solid var(--green-light)', paddingBottom: 8, display: 'inline-block' }}>Hình ảnh đính kèm</h3>
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: imagesList.length === 1 ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))', 
                        gap: 24 
                      }}>
                        {imagesList.map((img, idx) => (
                          <div key={idx} style={{ 
                            position: 'relative', 
                            overflow: 'hidden', 
                            borderRadius: 12, 
                            boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                            aspectRatio: imagesList.length === 1 ? 'auto' : '4/3',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.12)';
                            e.currentTarget.querySelector('img').style.transform = 'scale(1.03)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)';
                            e.currentTarget.querySelector('img').style.transform = 'scale(1)';
                          }}
                          >
                            <img
                              src={`/uploads/${img}`}
                              alt={`Đính kèm ${idx + 1}`}
                              style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: imagesList.length === 1 ? 'contain' : 'cover',
                                display: 'block',
                                transition: 'transform 0.5s ease'
                              }}
                            />
                          </div>
                        ))}
                      </div>
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
