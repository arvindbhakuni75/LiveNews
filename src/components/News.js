import React, { useState, useEffect } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const apiKey = '0eb3c63517fc4ca593bb35bfaa936009';

  const  updateNews = async ()=> {
    props.setProgress(10);
    let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${apiKey}&page=${page}&pageSize=${props.pageSize}`;
    setLoading({ loading: true });
    let data = await fetch(url);
    props.setProgress(30);
    let parsedData = await data.json();
    props.setProgress(70);
    setArticles (parsedData.articles)
    setTotalResults (parsedData.totalResults)
    setLoading (false)
   
    props.setProgress(100);
  }

  useEffect (() => {
    document.title = `NewsDekho - ${capitalizeFirstLetter(props.category)}`;
    updateNews();
    // eslint-disable-next-line
  }, []);
  

  const fetchMoreData = async () => {
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${apiKey}&page=${page+1}&pageSize=${props.pageSize}`;
    setPage(page+1);
    let data = await fetch(url);
    let parsedData = await data.json();
    setArticles(articles.concat(parsedData.articles));
    setTotalResults(parsedData.totalResults);
  };

   const capitalizeFirstLetter =(string)=> {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

    return (
      <>
        <h2 className="text-center my-3" style={{paddingTop: '60px'}}>
          NewsDekho - Top {capitalizeFirstLetter(props.category)} News
          Headlines
        </h2>
        {loading && <Spinner />}

        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length !== totalResults}
          loader={<Spinner />}
        >
          <div className="container">
          <div className="row">
            {articles &&
              articles.map((element) => {
                return (
                  <div className="col-md-4" key={element.url}>
                    <NewsItem
                      title={element.title}
                      description={element.description}
                      imageUrl={
                        element.urlToImage
                          ? element.urlToImage
                          : "https://st1.bgr.in/wp-content/uploads/2023/01/Tecno-Phantom-X2-6.jpg"
                      }
                      newsUrl={element.url}
                      author={element.author}
                      date={element.publishedAt}
                      source={element.source.name}
                    />
                  </div>
                );
              })};
          </div>
          </div>
        </InfiniteScroll>
        
      </>
    );
  }

  News.defaultProps = {
    country: "in",
    pageSize: 9,
    categiry: "general",
  };

  News.propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    categiry: PropTypes.string,
  }

export default News;
