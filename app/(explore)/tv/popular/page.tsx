import { getPopularTvShows } from "@/lib/api";
import WithPagination from "../../components/WithPagination";

export const metadata = {
  title: "Popular Tv Shows | Watchfolio",
  description: "List of popular tv shows",
};

export default WithPagination(getPopularTvShows);