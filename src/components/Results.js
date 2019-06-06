/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import axios from 'axios';

class Results extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      repo: null,
      commits: null,
      currentCommit: null,
      currentCommitLoading: false,
    };

    this.setCurrentCommit = this.setCurrentCommit.bind(this);
  }

  async componentDidMount() {
    const { owner, name } = this.props.match.params;
    const repo = await axios.get(`https://api.github.com/repos/${owner}/${name}`)
    const commits = await axios.get(`https://api.github.com/repos/${owner}/${name}/commits`);
    if (repo) {
      this.setState({
        repo: {
          name: repo.data.full_name,
          url: repo.data.url,
        }
      })
    }
    if (commits) {
      this.setState({
        commits: commits.data.map(commit => {
          return {
            sha: commit.sha,
            author: commit.author.login,
            url: commit.url,
            message: commit.commit.message,
          };
        }),
        loading: false,
      });
    }
  }
  
  setCurrentCommit(e, commit) {
    e.preventDefault();

    this.setState({
      currentCommitLoading: true,
      currentCommit: {
        sha: commit.sha,
      }
    })

    axios.get(commit.url).then(({ data }) => {
      const currentCommit = {
        sha: data.sha,
        message: data.commit.message,
        author: data.author.login,
        avatar: data.author.avatar_url,
        date: data.commit.committer.date,
        files: data.files.map((file) => {
          return {
            name: file.filename,
            status: file.status,
          }
        }),
      };

      this.setState({
        currentCommit,
        currentCommitLoading: false,
      })
    })
  }  

  render() {
    const { repo, commits, currentCommit, currentCommitLoading, loading } = this.state;

    if (loading) {
      return (
        <div className="h-screen bg-gray-300 flex justify-center items-center">
          <p className="text-gray-600 text-sm">Loading...</p>
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-gray-300 py-20">
        <div className="container m-auto">
          {repo && (
            <h1 className="font-bold text-3xl text-center text-gray-800">
              {repo.name}
            </h1>
          )}
          <div className="flex mt-10">
            <div className="bg-white w-1/2 overflow-hidden rounded shadow-lg">
              {commits &&
                commits.map(el => {
                  const activeClass = currentCommit && currentCommit.sha === el.sha ? 'bg-gray-100 shadow-inner' : '';
                  return (
                    <div key={el.sha}>
                      <a
                        className={`block px-5 py-4 border-b hover:bg-gray-100 cursor-pointer ${activeClass}`}
                        onClick={e => this.setCurrentCommit(e, el)}
                        href="#"
                      >
                        <span className="block text-gray-800 font-bold text-sm">
                          {el.message.substring(0, 70)}
                          {el.message.length > 70 && '...'}
                        </span>
                        <span className="block text-gray-600 text-xs">
                          by {el.author}
                        </span>
                      </a>
                    </div>
                  )
                })}
            </div>
            <div className="bg-white w-1/2 px-5 py-5 shadow-lg ml-10 rounded max-h-screen">
              {
                currentCommitLoading && <p className="text-gray-600">Loading...</p>
              }
              {
                !currentCommit && !currentCommitLoading && <p className="text-gray-600">Please select a commit</p>
              }
              {
                currentCommit && !currentCommitLoading && (
                  <>
                    <h4 className="font-bold text-gray-800 pb-3 border-b">{currentCommit.message}</h4>
                    <div className="flex items-center mb-5 mt-5">
                      <img className="w-6 h-6 rounded-full mr-2" src={currentCommit.avatar} alt="" />
                      <p className="text-sm text-gray-600">
                        by
                        {' '}
                        <span className="text-gray-900 font-semibold">{currentCommit.author}</span>
                        {' '}
                        on {new Date(currentCommit.date).toLocaleDateString()}
                      </p>
                    </div>
                    <h5 className="text-gray-900 font-semibold text-sm">Files changed</h5>
                    <ul className="list-disc mt-3 pl-5">
                      {
                      currentCommit.files.map((file) => {
                        let statusClass = 'text-yellow-600';
                        if (file.status === 'added') {
                          statusClass = 'text-green-600';
                        }
                        if (file.status === 'deleted') {
                          statusClass = 'text-red-600';
                        }
                        return <li key={file.name} className={`text-sm ${statusClass}`}>{file.name}</li>;
                      })
                      }
                    </ul>
                  </>
                )
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Results;
