import { getTopRatedTvShows } from "@/lib/api";
import WithPagination from "../../components/WithPagination";

export const metadata = {
  title: "Top Rated Tv Shows | Watchfolio",
  description: "List of top rated tv shows",
};

export default WithPagination(getTopRatedTvShows);