import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

export class News extends Component {
  static defaultProps = {
    country: "in",
    pageSize: 8,
    category: "general",
  };

  static propsTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  };

  constructor(props) {
    super(props);
    console.log("this is a constructor");
    this.state = {
      // articles: this.articles,
      articles: [],
      loading: false,
      page: 1,
      totalResults: 0,
    };
    document.title = `D_S_News | ${this.props.category}`;
  }

  handlePreviousclick = async () => {
    this.setState({ page: this.state.page - 1 });
    this.updateNews();
  };
  handleNextclick = async () => {
    this.setState({ page: this.state.page + 1 });
    this.updateNews();
  };

  async updateNews(pageNo) {
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=9bce55cd52ad46429a22d94bb2afccbc&page=${this.state.page}&pageSize= ${this.props.pageSize}`;

    this.setState({ loading: true });
    let data = await fetch(url);
    let parsedData = await data.json();

    this.setState({
      articles: parsedData.articles,
      totalResults: parsedData.totalResults,
      loading: false,
    });
  }
  fetchMoreData = async () => {};

  async componentDidMount() {
    this.updateNews();
  }

  render() {
    return (
      <>
        <div className="container my-3 ">
          <h1 className="text-center">
            D_S_News - Top {this.props.category} Headlines
          </h1>
          {/* {this.state.loading && <Spinner />} */}

          <InfiniteScroll
            dataLength={this.state.articles.length}
            next={this.fetchMoreData}
            hasMore={this.state.articles.length !== this.state.totalResults}
            loader={<Spinner />}
          >
            <div className="row">
              {this.state.articles.map((element) => {
                return (
                  <div className="col-md-4" key={element.url}>
                    <NewsItem
                      title={element.title ? element.title.slice(0, 40) : ""}
                      description={
                        element.description
                          ? element.description.slice(0, 58)
                          : ""
                      }
                      imageUrl={
                        element.urlToImage
                          ? element.urlToImage
                          : "https://image.shutterstock.com/image-vector/breaking-news-background-world-global-260nw-719766118.jpg"
                      }
                      newsUrl={element.url}
                      author={element.author}
                      date={element.publishedAt}
                      source={element.source.name}
                    />
                  </div>
                );
              })}
            </div>
          </InfiniteScroll>
        </div>
      </>
    );
  }
}

export default News;
