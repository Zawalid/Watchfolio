import { getTopRatedMovies } from "@/lib/api/TMDB";
import WithPagination from "../../_components/WithPagination";

export const metadata = {
  title: "Top Rated Movies",
  description: "List of top rated movies",
};


export default WithPagination(getTopRatedMovies);
