import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStarHalfStroke } from '@fortawesome/free-solid-svg-icons';
import Translator from '../Translator';

function Reviews({GlobalState,storeData}) {
  const {
    api,language
  } = GlobalState;
  
  const [storeReviewsScore, setStoreReviewsScore] = useState([]);
  const [storeReviewsData, setStoreReviewsData] = useState([]);
  const [skeletonStoreReviewsData,setSkeletonStoreReviewsData] = useState(true);

  useEffect(() => {
    const fetchStoreReviewsData = async () => {
      try {
        const response = await fetch(`${api}/get_store_reviews.php?storeId=${storeData.id}`);
        const data = await response.json();
        setStoreReviewsData(data);

        var total = 0;
        for (let i=0;i<data.length;i++){
          total+=parseFloat(data[i].stars);
        }
        setStoreReviewsScore(total/data.length);
        setSkeletonStoreReviewsData(false);
      } catch (error) {
        console.error('fetchStoreReviewsData:', error);
      }
    };
  
    fetchStoreReviewsData();
  }, []);

  const StarRating = ({ stars }) => {
    const roundedStars = Math.floor(stars);
    const hasHalfStar = stars % 1 !== 0;
    const starElements = [];
  
    for (let i = 0; i < roundedStars; i++) {
      starElements.push(<FontAwesomeIcon key={i} icon={faStar} />);
    }
  
    if (hasHalfStar) {
      starElements.push(<FontAwesomeIcon key="half" icon={faStarHalfStroke} />);
    }
    
    // for (let i = starElements.length; i < 5; i++){
    //   starElements.push(<FontAwesomeIcon key={i} className='empty-star' icon={faStar} />);
    // }

    return <div>{starElements}</div>;
  };
  
  return (
    <div>
      <div className='section-title reviews-title'>
        {skeletonStoreReviewsData ? ( //skeletonStoreReviewsData
          <>
            <h2 className='skeleton-box'>Reviews</h2>
            <div className='store-stars'>
              <div className='total-score'>
                <span className='skeleton-box'>4.5</span>
                <span className='skeleton-box'>{`R E V I E W S`}</span>
              </div>
              <span className='skeleton-box total-reviews'>Votes : 0</span>
            </div>
         </>
        ) : (
          <>
            <h2>
              <Translator 
                code={language}
                value={"Reviews"}
              />
            </h2>
            {storeReviewsData.length>0 && (
              <div className='store-stars'>
                <div className='total-score'>
                  <span>{parseFloat(storeReviewsScore).toFixed(1)}</span>
                  <StarRating stars={storeReviewsScore}/>
                </div>
                <span className='total-reviews'>
                  <Translator
                    code={language}
                    value={`Votes`}
                  />
                  {`: `}
                  {storeReviewsData.length}</span>
              </div>  
            )}
          </>
        )}
      </div>
      <div className="reviews-block">
        {skeletonStoreReviewsData && (
          <>
            <div className='review card skeleton-box'></div>
            <div className='review card skeleton-box'></div>
          </>
        )}
        {storeReviewsData.map((review,index) => (
          <div key={index} className='review card'>
            <div className='profile'>{review.first_name.charAt(0) + review.last_name.charAt(0)}</div>
            <div className='profile-review'>
              <strong>{review.first_name} {review.last_name.charAt(0) + "."}</strong>
              <div className='info'>
                <div className='stars'>
                  <StarRating stars={review.stars} />
                </div>
                <div className='date'>
                  {new Date(review.timestamp).toLocaleDateString()}
                </div>
              </div>
              <div className='comment'>
                {review.comment}
              </div>
            </div>
          </div>
        ))}
        {(!skeletonStoreReviewsData && storeReviewsData.length==0) && (
          <div className="card">
            <Translator 
              code={language}
              value={"Oops! It appears that there are currently no reviews for this store."}
              classNames={"message"}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default Reviews