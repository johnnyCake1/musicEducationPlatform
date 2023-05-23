import './SearchBar.css'

const SearchBar = () => {
  return (
    <form className="search-bar">
      <div className="form-control">
        <input
          className="form-input"
          type="text"
          placeholder="Enter course you are interested in"
        />
        <button className="form-button">Search</button>
      </div>
    </form>
  );
};

export default SearchBar;