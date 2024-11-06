import { getTopRatedMovies } from "@/lib/TMDB";
import WithPagination from "../../components/WithPagination";

export const metadata = {
  title: "Top Rated Movies",
  description: "List of top rated movies",
};


export default WithPagination(getTopRatedMovies);