import { Calendar, ChevronLeft, Clock, Heart, Play, Share2, Star, Users } from 'lucide-react';
import { Movie } from '../App';

interface MovieDetailProps {
  movie: Movie;
  onBookNow: () => void;
  onBack: () => void;
}

export function MovieDetail({ movie, onBookNow, onBack }: MovieDetailProps) {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Backdrop Image */}
      <div className="relative h-[450px]">
        <img
          src={movie.backdrop}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent"></div>
        
        {/* Back Button */}
        <button
          onClick={onBack}
          className="absolute top-6 left-6 w-10 h-10 bg-gray-900/80 backdrop-blur rounded-full flex items-center justify-center active:scale-95 transition-transform"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Action Buttons */}
        <div className="absolute top-6 right-6 flex gap-2">
          <button className="w-10 h-10 bg-gray-900/80 backdrop-blur rounded-full flex items-center justify-center active:scale-95 transition-transform">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 bg-gray-900/80 backdrop-blur rounded-full flex items-center justify-center active:scale-95 transition-transform">
            <Heart className="w-5 h-5" />
          </button>
        </div>

        {/* Play Trailer */}
        <button className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/20 backdrop-blur px-6 py-3 rounded-full active:scale-95 transition-transform">
          <Play className="w-5 h-5 fill-white" />
          <span>Xem trailer</span>
        </button>
      </div>

      {/* Content */}
      <div className="px-6 pb-24">
        {/* Title & Rating */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-yellow-500 text-gray-900 rounded-full text-xs">
              Đang chiếu
            </span>
            <span className="px-3 py-1 bg-gray-800 rounded-full text-xs">
              {movie.ageRating}
            </span>
          </div>
          <h1 className="text-3xl mb-3">{movie.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-300">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="text-lg">{movie.rating}</span>
              <span className="text-gray-400">/10</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{movie.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{movie.releaseDate}</span>
            </div>
          </div>
        </div>

        {/* Genre */}
        <div className="mb-6">
          <h3 className="text-sm text-gray-400 mb-2">Thể loại</h3>
          <div className="flex flex-wrap gap-2">
            {movie.genre.split(', ').map((genre) => (
              <span
                key={genre}
                className="px-3 py-1 bg-gray-900 border border-gray-800 rounded-full text-sm"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h3 className="text-sm text-gray-400 mb-2">Nội dung phim</h3>
          <p className="text-gray-300 leading-relaxed">{movie.description}</p>
        </div>

        {/* Cast */}
        <div className="mb-6">
          <h3 className="text-sm text-gray-400 mb-3 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Diễn viên
          </h3>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {movie.cast.map((actor, index) => (
              <div key={index} className="flex-shrink-0">
                <div className="w-20 h-20 bg-gray-800 rounded-full mb-2"></div>
                <p className="text-xs text-center line-clamp-2 w-20">{actor}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-gray-950 via-gray-950 to-transparent p-6 pb-8">
        <button
          onClick={onBookNow}
          className="w-full bg-yellow-500 text-gray-900 py-4 rounded-xl transition-all active:scale-95"
        >
          Đặt vé ngay
        </button>
      </div>
    </div>
  );
}
