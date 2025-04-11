// UpdatedMovie interface:
// - Represents the data used to update an existing movie record
// - Matches the NewMovie structure, typically used in update operations

export interface UpdatedMovie {
  title: string;
  type: string;
  director: string;
  cast: string;
  country: string;
  release_year: number;
  rating: string;
  duration: string;
  description: string;
  genres: string[];
}
