import { Calendar, Clock, Film, Star, TrendingUp } from 'lucide-react';
import { Movie } from '../App';

interface HomeProps {
  onSelectMovie: (movie: Movie) => void;
}

const movies: Movie[] = [
  {
    id: '1',
    title: 'Venom: The Last Dance',
    poster: 'https://images.unsplash.com/photo-1655367574486-f63675dd69eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5lbWElMjBtb3ZpZSUyMHBvc3RlcnxlbnwxfHx8fDE3NjYzNTEyNTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    backdrop: 'https://images.unsplash.com/photo-1534188278934-76700c2da08b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY3Rpb24lMjBtb3ZpZXxlbnwxfHx8fDE3NjY0NTIyMjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 8.5,
    duration: '109 phút',
    genre: 'Hành động, Khoa học viễn tưởng',
    releaseDate: '25/10/2024',
    description: 'Eddie và Venom đang chạy trốn. Bị truy đuổi bởi cả hai thế giới của họ và với lưới bao vây ngày càng thắt chặt, bộ đôi buộc phải đưa ra quyết định tàn khốc sẽ hạ màn vũ điệu cuối cùng của Venom và Eddie.',
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
    description: 'Câu chuyện về một trong những nhân vật truyền kỳ nhất Việt Nam - Công tử Bạc Liêu, người nổi tiếng với lối sống phóng khoáng và xa hoa vào đầu thế kỷ 20.',
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
    description: 'Khám phá hành trình khó khăn của Mufasa từ một chú sư tử mồ côi trở thành vị vua huyền thoại của Vương quốc Pride.',
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
    description: 'Câu chuyện chưa từng được kể về phù thủy ở xứ Oz, khám phá mối quan hệ phi thường giữa Elphaba và Glinda.',
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
    description: 'Một câu chuyện tình buồn đẹp lấy bối cảnh Sài Gòn những năm 90, về tình yêu thời học sinh và những kỷ niệm không thể quên.',
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
    description: 'Moana tiếp tục hành trình khám phá đại dương rộng lớn cùng Maui và những người bạn mới trong một cuộc phiêu lưu mới.',
    cast: ['Auli\'i Cravalho', 'Dwayne Johnson', 'Temuera Morrison'],
    ageRating: 'P',
  },
];

export function Home({ onSelectMovie }: HomeProps) {
  return (
    <div className="min-h-screen bg-gray-950 text-white pb-20">
      {/* Hero Banner */}
      <div className="relative h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={movies[0].backdrop}
            alt={movies[0].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent"></div>
        </div>
        
        <div className="relative h-full flex flex-col justify-end p-6 pb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-yellow-500 text-gray-900 rounded-full text-xs">
              Đang chiếu
            </span>
            <span className="px-3 py-1 bg-gray-800/80 backdrop-blur rounded-full text-xs">
              {movies[0].ageRating}
            </span>
          </div>
          <h1 className="text-3xl mb-3">{movies[0].title}</h1>
          <div className="flex items-center gap-4 mb-4 text-sm text-gray-300">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span>{movies[0].rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{movies[0].duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <Film className="w-4 h-4" />
              <span>{movies[0].genre.split(',')[0]}</span>
            </div>
          </div>
          <button
            onClick={() => onSelectMovie(movies[0])}
            className="w-full bg-yellow-500 text-gray-900 py-3 rounded-xl transition-all active:scale-95"
          >
            Đặt vé ngay
          </button>
        </div>
      </div>

      {/* Now Showing */}
      <div className="px-6 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-yellow-400" />
            Đang chiếu
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {movies.slice(1, 5).map((movie) => (
            <div
              key={movie.id}
              onClick={() => onSelectMovie(movie)}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-2">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-full object-cover transition-transform group-active:scale-95"
                />
                <div className="absolute top-2 right-2 bg-gray-900/90 backdrop-blur px-2 py-1 rounded-lg text-xs flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  {movie.rating}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60"></div>
              </div>
              <h3 className="text-sm line-clamp-2 mb-1">{movie.title}</h3>
              <p className="text-xs text-gray-400">{movie.genre.split(',')[0]}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Coming Soon */}
      <div className="px-6 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl flex items-center gap-2">
            <Calendar className="w-5 h-5 text-yellow-400" />
            Sắp chiếu
          </h2>
        </div>
        <div className="space-y-4">
          {movies.slice(4).map((movie) => (
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
                <div className="absolute top-2 left-2 bg-yellow-500 text-gray-900 px-2 py-1 rounded-lg text-xs">
                  Sớm
                </div>
              </div>
              <div className="flex-1 py-1">
                <h3 className="mb-2 line-clamp-2">{movie.title}</h3>
                <p className="text-sm text-gray-400 mb-2">{movie.genre}</p>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    {movie.rating}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {movie.duration}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
