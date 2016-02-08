import FilePlayer from 'react-player/lib/players/FilePlayer';

export default class FileInputPlayer extends FilePlayer {
  static displayName = 'FileInputPlayer';

  static canPlay (url) {
    return true
  }
}
