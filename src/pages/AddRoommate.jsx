import { useForm } from 'react-hook-form';
import { useContext } from 'react';
import { AuthContext } from '../provider/AuthProvider';
import { toast } from 'react-toastify';
import PrivateRoute from '../provider/PrivateRoute';

const AddRoommate = () => {
  const { user } = useContext(AuthContext);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user.getIdToken()}`
        },
        body: JSON.stringify({
          ...data,
          userEmail: user.email,
          userName: user.displayName,
          availability: 'Available',
          likes: 0
        })
      });

      if (!response.ok) throw new Error('Failed to create post');
      
      toast.success('Post created successfully!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-8 p-4 bg-background-light dark:bg-background-dark">
      <h1 className="text-3xl font-bold mb-6 text-center text-text-light dark:text-text-dark">Create Roommate Post</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text text-text-light dark:text-text-dark">Title</span>
          </label>
          <input
            {...register('title', { required: 'Title is required' })}
            className="input-field"
            placeholder="Looking for roommate in..."
          />
          {errors.title && <span className="text-error">{errors.title.message}</span>}
        </div>

        {/* Add other form fields similarly */}

        <div className="form-control mt-6">
          <button type="submit" className="btn-primary w-full">
            Create Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRoommate;