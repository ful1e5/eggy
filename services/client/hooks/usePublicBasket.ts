import { usePublicBasketQuery, PublicBasketDocument } from "generated/graphql";
import updateEggCache from "lib/basketCache";

function usePublicBasket() {
  const { data, loading, fetchMore, error } = usePublicBasketQuery({
    fetchPolicy: "cache-and-network"
  });

  if (loading) return { loading };
  if (error) return { error };
  if (!data) return { eggs: undefined };

  const loadMore = () => {
    return fetchMore({
      query: PublicBasketDocument,
      variables: {
        cursor: data.publicBasket.pageInfo.endCursor
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        return updateEggCache(fetchMoreResult, previousResult);
      }
    });
  };

  return {
    eggs: data.publicBasket.edges.map(({ node }: any) => node),
    hasNextPage: data.publicBasket.pageInfo.hasNextPage,
    loading,
    loadMore,
    error
  };
}
export default usePublicBasket;
