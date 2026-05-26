export const MY_REVIEWS_PAGE_SIZE = 10;

export function filterMyReviews(reviews, searchTerm) {
  const normalizedSearch = searchTerm.trim().toLowerCase();

  if (!normalizedSearch) {
    return reviews;
  }

  return reviews.filter((review) => review.place.name.toLowerCase().includes(normalizedSearch));
}
