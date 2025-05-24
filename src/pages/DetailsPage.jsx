import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { AuthContext } from '../provider/AuthProvider';
import { toast } from 'react-toastify';

const DetailsPage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState(null);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    fetch(`/api/posts/${id}`)
      .then(res => res.json())
      .then(data => setPost(data));
  }, [id]);

  const handleLike = async () => {
    if (post.userEmail === user.email) {
      toast.error("You can't like your own post!");
      return;
    }

    try {
      const response = await fetch(`/api/posts/${id}/like`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${await user.getIdToken()}`
        }
      });
      
      if (!response.ok) throw new Error('Like failed');
      setPost(prev => ({ ...prev, likes: prev.likes + 1 }));
      setShowContact(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {post && (
        <>
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          <p className="text-lg mb-2">Location: {post.location}</p>
          <p>Rent: ${post.rent}</p>
          <button onClick={handleLike} className="btn btn-primary mt-4">
            Like ({post.likes})
          </button>
          {showContact && <p className="mt-4">Contact: {post.contactInfo}</p>}
        </>
      )}
    </div>
  );
};
export default DetailsPage;