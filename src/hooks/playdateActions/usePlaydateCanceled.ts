
export function usePlaydateCanceled() {
  const handlePlaydateCanceled = async (refreshData: () => Promise<void>) => {
    await refreshData();
  };
  return { handlePlaydateCanceled };
}
