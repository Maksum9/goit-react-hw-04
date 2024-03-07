import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import { Button } from './components/Button/Button';
import { ImageGallery } from './components/ImageGallery/ImageGallery';
import { ImageGalleryItem } from './components/ImageGalleryItem/ImageGalleryItem';
import { Modal } from './components/Modal/Modal';
import { Searchbar } from './components/SearchBar/SearchBar';
import { Loader } from './components/Loader/Loader';

axios.defaults.baseURL = 'https://pixabay.com/api/';

export async function imagesApi({ search, page }) {
  try {
    const response = await axios.get('', {
      params: {
        key: 'AhhLj0dRDONF-RtR1JFfEMLloinwC9DISjhJf-DsIL4',
        q: search,
        image_type: 'photo',
        orientation: 'horizontal',
        per_page: '12',
        page: page,
      },
    });
    if (response.status !== 200) {
      message.notificationServerError();
      return;
    }
    return response;
  } catch (error) {
    message.notificationServerError();
    return;
  }
}

export function App() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalImages, setTotalImages] = useState(0);
  const [selectImage, setSelectImage] = useState(null);

  const maxPage = Math.ceil(totalImages / 12);
  const showButton = images.length > 0 && page < maxPage;

  useEffect(() => {
    if (search === '') {
      return;
    }

    async function newSearchRequestServer() {
      try {
        const response = await imagesApi({ search, page });
        const totalImages = response.data.totalHits;
        const images = response.data.hits;

        if (totalImages === 0 || images === '') {
          return message.notificationError();
        }
        if (page === 1) {
          message.notificationSuccess(totalImages);
        }
        setImages(prevState => [...prevState, ...images]);
        setTotalImages(totalImages);
      } catch (error) {
        message.notificationServerError();
      } finally {
        setLoading(false);
      }
    }

    setLoading(true);
    newSearchRequestServer();

    return () => {

    };
  }, [search, page]);

  function trackingSearchQuery(evt) {
    evt.preventDefault();

    const form = evt.currentTarget;
    const searchValue = form.elements.search.value;

    if (searchValue.trim() === '') {
      return message.notificationInfo();
    }
    setPage(1);
    setImages([]);
    setSearch(searchValue);

    form.reset();
  }

  function loadMoreImages() {
    setPage(prevState => prevState + 1);

    scrolling();
  }

  function openModal(evt) {
    const imageInfo = { alt: evt.target.alt, url: evt.currentTarget.dataset.large };

    setSelectImage(imageInfo);
  }

  function closeModal() {
    setSelectImage(null);
  }

  function scrolling() {
    const scroll = Scroll.animateScroll;
    scroll.scrollMore(650);
  }

  return (
    <>
      <Searchbar onSubmit={trackingSearchQuery} />
      <ImageGallery>
        {images.map(image => (
          <ImageGalleryItem key={image.id} image={image} onClick={openModal} />
        ))}
      </ImageGallery>
      {loading && <Loader />}
      {showButton && <Button onClick={loadMoreImages} />}
      {selectImage && <Modal onClose={closeModal} image={selectImage} />}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}
