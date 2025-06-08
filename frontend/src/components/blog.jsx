import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Mountain } from 'lucide-react';
import {useSelector, useDispatch} from 'react-redux'

const mockUser = {
  name: "John Doe",
  profilePic: "https://i.pravatar.cc/40?img=3", // You can replace this with actual user data
};

const Blog = () => {
  const Blogs = useSelector((state) => state.blogs.blogs); // Adjust path based on your slice

  const dispatch = useDispatch();

  const { _id } = useParams();
  const blog = Blogs?.find((b) => b._id === _id);
  console.log("blog :" + blog)

  // Find related blogs based on shared tags
  const relatedBlogs = Blogs.filter(
    (b) =>
      b._id !== blog._id &&
      b.tags?.some((tag) => blog.tags?.includes(tag))
  ).slice(0, 3); 

  console.log(relatedBlogs);
  const coverImage = blog.images?.[0];

  const [comment, setComment] = React.useState('');
  const [comments, setComments] = React.useState([]);
  const [likes, setLikes] = React.useState(0);
  const [commentLikes, setCommentLikes] = React.useState({});
  const [replyingTo, setReplyingTo] = React.useState(null);
  const [replyText, setReplyText] = React.useState('');

// Submit comment
const handleCommentSubmit = () => {
  if (comment.trim()) {
    dispatch(addCommentToBlog({
      blogId: _id,
      comment: {
        user: mockUser,
        text: comment,
      },
    }));
    setComment('');
  }
};

// Submit reply
const handleReplySubmit = (idx) => {
  if (replyText.trim()) {
    const commentId = blog.comments[idx]._id;
    dispatch(addReplyToComment({
      blogId: _id,
      commentId,
      reply: {
        user: mockUser,
        text: replyText,
      },
    }));
    setReplyText('');
    setReplyingTo(null);
  }
};

  const toggleCommentLike = (idx) => {
    setCommentLikes((prev) => ({
      ...prev,
      [idx]: prev[idx] ? prev[idx] + 1 : 1,
    }));
  };

  const handleBlogLike = () => {
    dispatch(likeBlog(blog._id))
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Blog link copied to clipboard!');
  };

  if (!blog) {
    return <div className="text-center text-red-500 pt-20">Blog not found</div>;
  }

  return (
    <div className="min-h-screen pt-14 flex flex-col items-center gap-4 pb-6 px-4">
      {coverImage && (
        <div className="w-full h-[300px] md:h-[500px] overflow-hidden">
          <img
            src={coverImage.url}
            alt="cover"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <h1 className="text-3xl font-semibold text-center">{blog.title}</h1>
      <p className="text-gray-400 text-center">By {blog.author} | {new Date(blog.publishDate).toLocaleDateString()}</p>
      <p className="text-blue-400 text-sm text-center">Destination: {blog.destination}</p>

      {/* Tags */}
      <div className="flex flex-wrap justify-center gap-2 mt-2">
        {blog.tags.map((tag, idx) => (
          <span key={idx} className="bg-blue-800 text-white px-3 py-1 rounded-full text-sm">
            #{tag}
          </span>
        ))}
      </div>

      {/* Story */}
      <div className="w-full md:w-[60%] bg-gray-900 text-white p-6 rounded-lg mt-4 shadow-lg">
        <p className="text-lg leading-relaxed">{blog.story}</p>
      </div>

      {/* Images */}
      {blog.images.map((img, index) => (
        <div
          key={index}
          className="w-full md:w-[60%] h-[400px] mt-4 rounded-lg overflow-hidden shadow-md"
        >
          <img src={img.url} alt={`blog-img-${index}`} className="w-full h-full object-cover" />
          {img.description && (
            <p className="text-center text-gray-400 mt-2 text-sm italic">{img.description}</p>
          )}
        </div>
      ))}

      {/* Like and Share */}
      <div className="flex items-center gap-6 mt-4">
        <button
          onClick={handleBlogLike}
          className="text-white bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-full"
        >
          👍 Like ({blog.likes})
        </button>
        <button
          onClick={handleShare}
          className="text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-full"
        >
          🔗 Share
        </button>
      </div>

      {/* Simillar Blogs Section */}
<section className="max-w-6xl mx-auto p-6 m-12 bg-gray-800 rounded-xl shadow-md">
  <h2 className="text-2xl font-semibold text-gray-200 mb-6 flex items-center">
    <Mountain className="mr-2 text-gray-200" size={24} /> Simillar Blogs
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {relatedBlogs.map((blog) => (
      <div
        key={blog._id}
        className="bg-gray-900 rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-[1.015] hover:shadow-lg h-full"
      >
        {/* Consistent image aspect ratio */}
        <div className="w-full h-32 md:h-40 overflow-hidden">
          <img
            src={blog.images[0].url}
            alt={`Related Blog ${blog._id}`}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>

        <div className="p-4 text-gray-50">
          <h3 className="font-semibold text-lg mb-2">{blog.title}</h3>
          <p className="text-sm">{blog.author}</p>
          <p className="text-sm">{blog.publishDate}</p>

          <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md mt-2 text-sm">
            <Link to={`/blogs/${blog._id}`}>
              View Details
            </Link>
          </button>
        </div>
      </div>
    ))}
  </div>
</section>


      {/* Comment Section */}
      <div className="w-full md:w-[60%] mt-6 bg-[#0f172a] rounded-xl p-6 shadow-lg border border-blue-900">
        <h3 className="text-2xl font-bold mb-4 text-white">Leave a Comment</h3>

        <textarea
          className="w-full bg-[#1e293b] border border-blue-800 text-white rounded-lg p-3 mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          placeholder="Share your thoughts..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <button
          className="bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2 rounded-lg font-semibold"
          onClick={handleCommentSubmit}
        >
          Post Comment
        </button>

        {/* Display Comments */}
        <div className="mt-6">
          <h4 className="text-xl font-semibold text-white mb-3">Comments</h4>
          {comments.length === 0 ? (
            <p className="text-sm text-gray-400">No comments yet. Be the first to share your thoughts!</p>
          ) : (
            comments.map((cmt, idx) => (
              <div key={idx} className="border-t border-blue-800 pt-3 mt-3 text-gray-200 text-sm">
                <div className="flex items-start gap-3">
                  <img
                    src={cmt.user.profilePic}
                    alt="profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold text-white">{cmt.user.name}</span>
                    <p>{cmt.text}</p>

                    <div className="flex gap-4 text-xs mt-2 text-blue-400">
                      <button onClick={() => toggleCommentLike(idx)}>👍 Like ({commentLikes[idx] || 0})</button>
                      <button onClick={() => setReplyingTo(idx)}>💬 Reply</button>
                    </div>

                    {/* Replies */}
                    {cmt.replies.length > 0 && (
                      <div className="ml-6 mt-2">
                        {cmt.replies.map((reply, rIdx) => (
                          <div key={rIdx} className="flex items-start gap-2 mt-2">
                            <img
                              src={reply.user.profilePic}
                              alt="reply-profile"
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div>
                              <span className="font-semibold text-white">{reply.user.name}</span>
                              <p className="text-sm">{reply.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply Input */}
                    {replyingTo === idx && (
                      <div className="mt-2">
                        <textarea
                          className="w-full bg-[#1e293b] border border-blue-800 text-white rounded-lg p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows={2}
                          placeholder="Write a reply..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                        />
                        <div className="flex gap-2 mt-1">
                          <button
                            onClick={() => handleReplySubmit(idx)}
                            className="bg-blue-600 px-3 py-1 rounded text-sm"
                          >
                            Reply
                          </button>
                          <button
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyText('');
                            }}
                            className="bg-red-600 px-3 py-1 rounded text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;
