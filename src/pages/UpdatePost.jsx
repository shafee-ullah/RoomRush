import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router';
import { AuthContext } from '../provider/AuthProvider';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';

const UpdatePost = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${id}`);
        if (!response.ok) throw new Error('Post not found');
        const data = await response.json();
        
        if (data.userEmail !== user.email) {
          toast.error('You are not authorized to edit this post');
          navigate('/my-listings');
          return;
        }
        
        setPost(data);
        reset(data);
        setLoading(false);
      } catch (error) {
        toast.error(error.message);
        navigate('/my-listings');
      }
    };

    fetchPost();
  }, [id, user, reset, navigate]);

  const onSubmit = async (formData) => {
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user.getIdToken()}`
        },
        body: JSON.stringify({
          ...formData,
          updatedAt: new Date()
        })
      });

      if (!response.ok) throw new Error('Update failed');
      
      toast.success('Post updated successfully!');
      navigate('/my-listings');
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-2xl mx-auto my-8 p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Update Post</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Title</span>
          </label>
          <input
            {...register('title', { required: 'Title is required' })}
            className="input input-bordered"
            placeholder="Post title"
          />
          {errors.title && <span className="text-error">{errors.title.message}</span>}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Location</span>
          </label>
          <input
            {...register('location', { required: 'Location is required' })}
            className="input input-bordered"
            placeholder="City, State"
          />
          {errors.location && <span className="text-error">{errors.location.message}</span>}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Rent Amount ($)</span>
          </label>
          <input
            type="number"
            {...register('rent', { required: 'Rent amount is required', min: 1 })}
            className="input input-bordered"
          />
          {errors.rent && <span className="text-error">{errors.rent.message}</span>}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Room Type</span>
          </label>
          <select
            {...register('roomType', { required: 'Room type is required' })}
            className="select select-bordered w-full"
          >
            <option value="Single">Single</option>
            <option value="Shared">Shared</option>
          </select>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <textarea
            {...register('description', { required: 'Description is required' })}
            className="textarea textarea-bordered h-32"
            placeholder="Describe the room and preferences..."
          />
          {errors.description && <span className="text-error">{errors.description.message}</span>}
        </div>

        <div className="form-control mt-6">
          <button type="submit" className="btn btn-primary w-full">
            Update Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdatePost;