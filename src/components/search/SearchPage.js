import React, { useState, useEffect } from 'react';
import { useLocation, withRouter } from 'react-router-dom';
import queryString from 'query-string';
import { css } from '@emotion/react';
import BeatLoader from 'react-spinners/BeatLoader';
import usePhotos from '../../hooks/usePhotos';
import HomePhotoList from '../others/photo-list/HomePhotoList';
import RelatedTagBar from '../others/RelatedTagBar';
import NavSearchBar from '../others/NavSearchBar';
import config from '../../config';

const override = css`
  display: flex;
  justify-content: center;
  align-item: center;
  margin-top: 3rem;
`;

const SearchPage = ({ authorizedUser }) => {
  const [allPhotos, setAllPhotos] = useState();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const parsed = queryString.parse(location.search);

  const variables = {
    searchKeyword: parsed.q,
    checkUserLike: !authorizedUser ? config.visitorID : authorizedUser.id,
    first: 15,
  };

  const { photos, fetchMore, hasNextPage } = usePhotos(variables);

  useEffect(() => {
    if (photos) {
      const temp = photos && photos.edges
        ? photos.edges.map((edge) => edge.node)
        : [];

      setAllPhotos(temp);
      setLoading(false);
    }
  }, [photos]);

  const clickFetchMore = () => {
    fetchMore();
    setLoading(true);
  };

  return (
    <div>
      <div className="p-3 container-profile">
        <div className="profile-item">
          <h3>Search:</h3>
        </div>
        <div className="container-row-searchpage-searchbox">
          <NavSearchBar placeholder={parsed.q} />
        </div>
      </div>
      <RelatedTagBar allPhotos={allPhotos} />
      { !photos && allPhotos && (<BeatLoader color="#9B9B9B" loading css={override} size={50} />) }
      <HomePhotoList
        allPhotos={allPhotos}
        setAllPhotos={setAllPhotos}
        clickFetchMore={clickFetchMore}
        loading={loading}
        hasNextPage={hasNextPage}
      />
    </div>
  );
};

export default withRouter(SearchPage);
