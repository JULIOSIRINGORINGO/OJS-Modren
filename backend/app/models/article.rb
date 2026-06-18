class Article < ApplicationRecord
  belongs_to :category
  belongs_to :user
  belongs_to :issue, optional: true

  has_many :bookmarks, dependent: :destroy
  has_many :bookmarking_users, through: :bookmarks, source: :user
  has_many :review_assignments, dependent: :destroy
  has_many :reviewers, through: :review_assignments, source: :user

  validates :title, :abstract, :authors, presence: true
  validates :status, presence: true, inclusion: { in: ['Submitted', 'Under Review', 'Reviewer Assigned', 'Awaiting Decision', 'Revision Required', 'Copyediting', 'Production', 'Accepted', 'Published', 'Rejected'] }

  before_validation :set_default_status, on: :create
  before_validation :set_default_submitted_at, on: :create
  before_validation :generate_default_body_text, on: :create

  private

  def set_default_status
    self.status ||= 'Submitted'
  end

  def set_default_submitted_at
    self.submitted_at ||= Time.current
  end

  def generate_default_body_text
    self.body_text ||= <<~TEXT
      # 1. Pendahuluan
      Naskah ilmiah yang berjudul "#{self.title}" ini membahas topik penelitian yang sangat relevan dengan perkembangan sains dan teknologi saat ini. Berdasarkan abstrak yang diajukan oleh penulis:

      "#{self.abstract}"

      Penelitian ini memfokuskan kajian pada perancangan sistem, pengolahan data terstruktur, serta analisis mendalam mengenai performa dari metode yang diusulkan. Pentingnya studi ini didorong oleh kebutuhan untuk menyelesaikan permasalahan taktis di lapangan serta memberikan pijakan teoretis yang kuat bagi penelitian lanjutan di masa mendatang.

      # 2. Kajian Pustaka & Metodologi
      Tahapan metodologi dalam penelitian ini dirancang secara sistematis untuk menjamin keandalan hasil analisis. Pengumpulan data atau simulasi awal dilakukan dengan mengacu pada literatur ilmiah terbaru yang relevan. Kami menerapkan pemrosesan awal (preprocessing) data guna menyaring noise dan mempersiapkan set data eksperimental.

      Pengujian performa algoritma atau kerangka kerja dilakukan dalam kondisi terkontrol dengan parameter yang telah diselaraskan. Evaluasi hasil dilakukan menggunakan metrik standar pengujian yang diakui secara luas di komunitas riset internasional untuk memastikan tingkat validitas yang tinggi.

      # 3. Hasil & Pembahasan
      Berdasarkan eksperimen yang telah dilakukan, hasil analisis menunjukkan peningkatan efisiensi dan akurasi yang signifikan dibandingkan dengan pendekatan konvensional. Data pengujian menunjukkan stabilitas performa sistem yang konsisten pada berbagai skenario uji coba.

      Pembahasan hasil riset ini menyoroti keunggulan arsitektur baru yang diusulkan, khususnya dalam menangani data dengan kompleksitas tinggi. Meskipun demikian, penelitian ini juga mencatat beberapa batasan operasional yang dapat dijadikan dasar perbaikan untuk pengembangan sistem di masa yang akan datang.

      # 4. Kesimpulan & Saran
      Studi ini berhasil menyimpulkan bahwa implementasi metode baru terbukti efektif dan andal dalam memecahkan masalah penelitian yang dirumuskan. Kontribusi utama dari makalah ini adalah pembuktian empiris mengenai efektivitas model pada studi kasus yang diteliti.

      Sebagai saran untuk penelitian mendatang, disarankan untuk memperluas cakupan variabel uji serta mengintegrasikan teknik optimasi tambahan guna meningkatkan performa sistem ke tingkat yang lebih optimal.
    TEXT
  end
end
