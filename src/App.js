import SearchBar from './Components/SearchBar';
import { useState, useEffect } from 'react';
import ImageGallery from './Components/ImageGallery';
import Modal from './Modal';
import Container from './Components/Container';
import Button from './Components/Button';
import MyLoader from './Components/Loader/Loader';
import Api from './Services/Api';

export default function App() {
  const [hits, setHits] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [url, setUrl] = useState('');
  const [tag, setTag] = useState('');

  useEffect(() => {
    fetchhits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const onChangeQuery = query => {
    setSearchQuery(query);
    setCurrentPage(1);
    setHits([]);
  };

  const handleImageClick = ({ target }) => {
    if (target.nodeName !== 'IMG') {
      return;
    }
    const { url } = target.dataset;
    const tag = target.alt;
    setUrl(url);
    setTag(tag);
    setIsLoading(false);
    toggleModal(false);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const fetchhits = () => {
    setIsLoading(true);
    const options = { searchQuery, currentPage };

    Api.findImage(options)
      .then(responseHits => {
        setHits(prevHits => [...prevHits, ...responseHits]);
        setCurrentPage(prevCurrentpage => prevCurrentpage + 1);
      })
      .then(() => {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth',
        });
      })
      .catch(error => setError({ error }))
      .finally(() => setIsLoading(false));
  };

  return (
    <Container>
      <SearchBar onSubmit={onChangeQuery} />
      <ImageGallery hits={hits} onClick={handleImageClick} />
      {isLoading && <MyLoader />}
      {hits.length > 0 && !isLoading && <Button onClick={fetchhits} />}
      {showModal && (
        <Modal onClose={toggleModal}>
          <img src={url} alt={tag} />
        </Modal>
      )}
    </Container>
  );
}

// export default class App extends Component {
//   state = {
//     hits: [],
//     currentPage: 1,
//     searchQuery: '',
//     isLoading: false,
//     showModal: false,
//     error: null,
//     url: '',
//     tag: '',
//   };

//   toggleModal = () => {
//     this.setState(({ showModal }) => ({
//       showModal: !showModal,
//     }));
//   };

//   componentDidUpdate(prevProps, prevState) {
//     if (prevState.searchQuery !== this.state.searchQuery) {
//       this.fetchhits();
//     }
//   }

// onChangeQuery = query => {
//   this.setState({
//     searchQuery: query,
//     currentPage: 1,
//     hits: [],
//     error: null,
//   });
// };

// fetchhits = () => {
//   const { currentPage, searchQuery } = this.state;

//   this.setState({ isLoading: true });

//   return Api.findImage(currentPage, searchQuery)
//     .then(hits => {
//       this.setState(prevState => ({
//         hits: [...prevState.hits, ...hits],
//         currentPage: prevState.currentPage + 1,
//       }));
//     })
//     .then(() => {
//       window.scrollTo({
//         top: document.documentElement.scrollHeight,
//         behavior: 'smooth',
//       });
//     })
//     .catch(error => this.setState({ error }))
//     .finally(() => this.setState({ isLoading: false }));
// };

// handleImageClick = ({ target }) => {
//   if (target.nodeName !== 'IMG') {
//     return;
//   }
//   const { url } = target.dataset;
//   const tag = target.alt;
//   this.setState({
//     url,
//     tag,
//     isLoading: false,
//   });
//   this.toggleModal();
// };

//   render() {
//     const { hits, showModal, isLoading, url, tag } = this.state;

//     return (
// <Container>
//   <SearchBar onSubmit={this.onChangeQuery} />
//   <ImageGallery hits={hits} onClick={this.handleImageClick} />
//   {isLoading && <MyLoader />}
//   {hits.length > 0 && !isLoading && <Button onClick={this.fetchhits} />}
//   {showModal && (
//     <Modal onClose={this.toggleModal} onClick={this.handleImageClick}>
//       <img src={url} alt={tag} />
//     </Modal>
//   )}
// </Container>
//     );
//   }
// }
