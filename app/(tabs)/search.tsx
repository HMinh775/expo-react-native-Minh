import { Calendar, Clock, Film, Search as SearchIcon, Star, TrendingUp, X } from 'lucide-react';
import { useState } from 'react';
import { Movie } from '../App';

interface SearchProps {
  onSelectMovie: (movie: Movie) => void;
}

const allMovies: Movie[] = [
  {
    id: '1',
    title: 'Venom: The Last Dance',
    poster: 'https://images.unsplash.com/photo-1655367574486-f63675dd69eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5lbWElMjBtb3ZpZSUyMHBvc3RlcnxlbnwxfHx8fDE3NjYzNTEyNTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    backdrop: 'https://images.unsplash.com/photo-1534188278934-76700c2da08b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY3Rpb24lMjBtb3ZpZXxlbnwxfHx8fDE3NjY0NTIyMjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 8.5,
    duration: '109 phút',
    genre: 'Hành động, Khoa học viễn tưởng',
    releaseDate: '25/10/2024',
    description: 'Eddie và Venom đang chạy trốn.',
    cast: ['Tom Hardy', 'Chiwetel Ejiofor', 'Juno Temple'],
    ageRating: 'T13',
  },
  {
    id: '2',
    title: 'Công Tử Bạc Liêu',
    poster: 'https://images.unsplash.com/photo-1655367574486-f63675dd69eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5lbWElMjBtb3ZpZSUyMHBvc3RlcnxlbnwxfHx8fDE3NjYzNTEyNTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    backdrop: 'https://images.unsplash.com/photo-1534188278934-76700c2da08b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY3Rpb24lMjBtb3ZpZXxlbnwxfHx8fDE3NjY0NTIyMjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 7.8,
    duration: '115 phút',
    genre: 'Chính kịch, Tiểu sử',
    releaseDate: '13/12/2024',
    description: 'Câu chuyện về Công tử Bạc Liêu.',
    cast: ['Song Luân', 'Kaity Nguyễn', 'Hồng Vân'],
    ageRating: 'T16',
  },
  {
    id: '3',
    title: 'Mufasa: The Lion King',
    poster: 'https://images.unsplash.com/photo-1655367574486-f63675dd69eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5lbWElMjBtb3ZpZSUyMHBvc3RlcnxlbnwxfHx8fDE3NjYzNTEyNTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    backdrop: 'https://images.unsplash.com/photo-1534188278934-76700c2da08b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY3Rpb24lMjBtb3ZpZXxlbnwxfHx8fDE3NjY0NTIyMjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 8.2,
    duration: '118 phút',
    genre: 'Hoạt hình, Phiêu lưu, Gia đình',
    releaseDate: '20/12/2024',
    description: 'Hành trình của Mufasa.',
    cast: ['Aaron Pierre', 'Kelvin Harrison Jr.', 'Blue Ivy Carter'],
    ageRating: 'P',
  },
  {
    id: '4',
    title: 'Wicked',
    poster: 'https://images.unsplash.com/photo-1655367574486-f63675dd69eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5lbWElMjBtb3ZpZSUyMHBvc3RlcnxlbnwxfHx8fDE3NjYzNTEyNTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    backdrop: 'https://images.unsplash.com/photo-1534188278934-76700c2da08b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY3Rpb24lMjBtb3ZpZXxlbnwxfHx8fDE3NjY0NTIyMjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 9.0,
    duration: '160 phút',
    genre: 'Nhạc kịch, Giả tưởng, Lãng mạn',
    releaseDate: '22/11/2024',
    description: 'Câu chuyện về phù thủy ở xứ Oz.',
    cast: ['Cynthia Erivo', 'Ariana Grande', 'Jonathan Bailey'],
    ageRating: 'T13',
  },
  {
    id: '5',
    title: 'Ngày Xưa Có Một Chuyện Tình',
    poster: 'https://images.unsplash.com/photo-1655367574486-f63675dd69eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5lbWElMjBtb3ZpZSUyMHBvc3RlcnxlbnwxfHx8fDE3NjYzNTEyNTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    backdrop: 'https://images.unsplash.com/photo-1534188278934-76700c2da08b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY3Rpb24lMjBtb3ZpZXxlbnwxfHx8fDE3NjY0NTIyMjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 8.7,
    duration: '135 phút',
    genre: 'Lãng mạn, Chính kịch',
    releaseDate: '01/11/2024',
    description: 'Chuyện tình buồn đẹp.',
    cast: ['Avin Lu', 'Ngọc Xuân', 'Đỗ Nhật Hoàng'],
    ageRating: 'T16',
  },
  {
    id: '6',
    title: 'Moana 2',
    poster: 'https://images.unsplash.com/photo-1655367574486-f63675dd69eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5lbWElMjBtb3ZpZSUyMHBvc3RlcnxlbnwxfHx8fDE3NjYzNTEyNTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    backdrop: 'https://images.unsplash.com/photo-1534188278934-76700c2da08b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY3Rpb24lMjBtb3ZpZXxlbnwxfHx8fDE3NjY0NTIyMjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 8.4,
    duration: '100 phút',
    genre: 'Hoạt hình, Phiêu lưu, Gia đình',
    releaseDate: '29/11/2024',
    description: 'Moana tiếp tục hành trình.',
    cast: ['Auli\'i Cravalho', 'Dwayne Johnson', 'Temuera Morrison'],
    ageRating: 'P',
  },
];

const genres = [
  'Tất cả',
  'Hành động',
  'Khoa học viễn tưởng',
  'Lãng mạn',
  'Hoạt hình',
  'Chính kịch',
  'Nhạc kịch',
];

export function Search({ onSelectMovie }: SearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Tất cả');

  const filteredMovies = allMovies.filter((movie) => {
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.genre.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'Tất cả' || movie.genre.includes(selectedGenre);
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-gray-950 z-10 px-6 pt-6 pb-4 border-b border-gray-800">
        <h1 className="text-2xl mb-4">Tìm kiếm phim</h1>
        
        {/* Search Bar */}
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm phim, thể loại..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-12 pr-12 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Genre Filter */}
      <div className="px-6 py-4 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                selectedGenre === genre
                  ? 'bg-yellow-500 text-gray-900'
                  : 'bg-gray-800 text-gray-300 active:bg-gray-700'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="px-6">
        {searchQuery && (
          <p className="text-sm text-gray-400 mb-4">
            Tìm thấy {filteredMovies.length} kết quả
          </p>
        )}

        {filteredMovies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Film className="w-16 h-16 text-gray-700 mb-4" />
            <p className="text-gray-400">Không tìm thấy phim nào</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMovies.map((movie) => (
              <div
                key={movie.id}
                onClick={() => onSelectMovie(movie)}
                className="flex gap-4 cursor-pointer active:opacity-70 transition-opacity"
              >
                <div className="relative w-28 aspect-[2/3] rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-gray-900/90 backdrop-blur px-2 py-1 rounded-lg text-xs flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    {movie.rating}
                  </div>
                </div>
                <div className="flex-1 py-1">
                  <h3 className="mb-2 line-clamp-2">{movie.title}</h3>
                  <p className="text-sm text-gray-400 mb-3 line-clamp-1">{movie.genre}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {movie.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {movie.releaseDate}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Popular Searches */}
      {!searchQuery && (
        <div className="px-6 mt-8">
          <h2 className="text-lg mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-yellow-400" />
            Tìm kiếm phổ biến
          </h2>
          <div className="flex flex-wrap gap-2">
            {['Hành động', 'Khoa học viễn tưởng', 'Hoạt hình', 'Lãng mạn', 'Kinh dị', 'Hài'].map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-full text-sm text-gray-300 active:bg-gray-800 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
