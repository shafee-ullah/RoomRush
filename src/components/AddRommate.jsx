import { useForm } from 'react-hook-form';
import { useContext } from 'react';
import { AuthContext } from '../provider/AuthProvider';
import { toast } from 'react-toastify';

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
          likes: 0,
          likedBy: []
        })
      });

      if (!response.ok) throw new Error('Failed to create post');
      toast.success('Post created successfully!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-8 p-4">
      <h1 className="text-3xl font-bold mb-6">Create Roommate Post</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Form fields */}
        <button type="submit" className="btn btn-primary w-full">Create Post</button>
      </form>
    </div>
  );
};
export default AddRoommate;