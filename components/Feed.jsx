'use client';
import { useState, useEffect } from 'react';
import PromptCard from './PromptCard';

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={() => handleTagClick(post.tag)}
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const [searchText, setSearchText] = useState('');
  const [searchedResult, setSearchedResult] = useState(null);
  const [posts, setPosts] = useState([]);
  const [searchTimeout, setSearchTimeout] = useState(null);

  const filterPrompts = (searchedText) => {
    const regex = new RegExp(searchedText, 'i');

    return posts.filter(
      (post) =>
        regex.test(post.creator.username) ||
        regex.test(post.tag) ||
        regex.test(post.prompt)
    );
  };

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    setSearchTimeout(
      setTimeout(() => {
        const searchResult = filterPrompts(e.target.value);
        setSearchedResult(searchResult);
      }, 500)
    );
  };

  const handleTagClick = (tagName) => {
    setSearchText(tagName);
    const searchResult = filterPrompts(tagName);
    setSearchedResult(searchResult);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch('/api/prompt');
      const data = await response.json();

      setPosts(data);
    };

    fetchPosts();
  }, []);

  return (
    <section className="feed">
      <form className=" relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or a username"
          required
          value={searchText}
          onChange={handleSearchChange}
          className="search_input peer"
        />
      </form>

      <PromptCardList
        data={searchedResult ? searchedResult : posts}
        handleTagClick={handleTagClick}
      />
    </section>
  );
};

export default Feed;
