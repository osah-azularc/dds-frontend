const PageNotFound = () => {
  return (
    <div className="not-found-container">
      <h2>Sorry, page not found!</h2>
      <span>
        Sorry, we couldn't find the page you're looking for. Perhaps you've mistyped the URL? Be
        sure to check your spelling.
      </span>
      <div className="form-button">
        <button type="button">Go to Home</button>
      </div>
    </div>
  );
};

export default PageNotFound;
