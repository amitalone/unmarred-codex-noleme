import { useState, useEffect } from 'react';

type FetchFunction<T, P extends any[]> = (...params: P) => Promise<any>;

export function useInfiniteData<T, P extends any[]>(
  fetchFn: FetchFunction<T, P>,
  baseParams: any, 
  getPageParam: (page: number) => P
) {
  const [data, setData] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start with loading
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState<boolean>(false);

  // Only load page 1 once when the component mounts
  useEffect(() => {
    // If we've already done the initial load, don't do it again
    if (initialLoadComplete) return;

    async function loadInitialData() {
      try {
        const pageParams = getPageParam(1);
        console.log('Loading initial data with params:', pageParams);
        const newData = await fetchFn(...pageParams);
        console.log('Received initial data:', newData);
        
        if (Array.isArray(newData) && newData.length > 0) {
          setData(newData as T[]);
        } else if (newData && typeof newData === 'object' && !Array.isArray(newData)) {
          // Handle case where API returns an object with data property
          const dataArray = (newData as any).data || newData;
          if (Array.isArray(dataArray) && dataArray.length > 0) {
            setData(dataArray as T[]);
          } else {
            setHasMore(false);
          }
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        setHasMore(false);
      } finally {
        setIsLoading(false);
        setInitialLoadComplete(true);
      }
    }
    
    loadInitialData();
  // Empty dependency array ensures this only runs once when component mounts
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Simple function that just logs the next page without actually loading it
  function loadNextPage() {
    if (isLoading || !hasMore) return;
    
    const nextPage = currentPage + 1;
    console.log(`Loading page ${nextPage} with params:`, getPageParam(nextPage));
    
    // Set loading state
    setIsLoading(true);
    
    // Fetch the next page
    const pageParams = getPageParam(nextPage);
    fetchFn(...pageParams)
      .then(newData => {
        console.log(`Received data for page ${nextPage}:`, newData);
        
        if (Array.isArray(newData) && newData.length > 0) {
          // Append the new data to the existing data
          setData(prev => [...prev, ...newData as T[]]);
          // Update the current page
          setCurrentPage(nextPage);
        } else if (newData && typeof newData === 'object' && !Array.isArray(newData)) {
          // Handle case where API returns an object with data property
          const dataArray = (newData as any).data || newData;
          if (Array.isArray(dataArray) && dataArray.length > 0) {
            setData(prev => [...prev, ...dataArray as T[]]);
            setCurrentPage(nextPage);
          } else {
            // No more data to load
            console.log('No more data available, setting hasMore to false');
            setHasMore(false);
          }
        } else {
          // No more data to load
          console.log('No more data available, setting hasMore to false');
          setHasMore(false);
        }
      })
      .catch(error => {
        console.error(`Error fetching data for page ${nextPage}:`, error);
        setHasMore(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return { data, isLoading, hasMore, loadNextPage };
}
