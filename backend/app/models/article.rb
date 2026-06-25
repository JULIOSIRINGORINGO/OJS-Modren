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
  before_save :populate_publication_metadata
  after_save :recalculate_issue_pages, if: :saved_change_to_issue_id?

  def display_volume
    if issue&.volume.present?
      issue.volume
    elsif read_attribute(:volume).present?
      read_attribute(:volume)
    else
      vol = Setting.get('current_volume', '12')
      "Vol. #{vol}"
    end
  end

  def display_issue
    if issue&.number.present?
      issue.number
    elsif read_attribute(:issue).present?
      read_attribute(:issue)
    else
      iss = Setting.get('current_issue', '2')
      "Edisi #{iss}"
    end
  end

  def display_year
    if issue&.year.present?
      issue.year
    elsif published_at.present?
      published_at.year
    else
      Setting.get('current_year', Time.current.year.to_s).to_i
    end
  end

  def display_doi
    if doi.present?
      doi
    else
      vol_num = if issue&.volume.present?
                  issue.volume.to_s.gsub(/\D/, '')
                elsif read_attribute(:volume).present?
                  read_attribute(:volume).to_s.gsub(/\D/, '')
                else
                  Setting.get('current_volume', '12')
                end

      iss_num = if issue&.number.present?
                  issue.number.to_s.gsub(/\D/, '')
                elsif read_attribute(:issue).present?
                  read_attribute(:issue).to_s.gsub(/\D/, '')
                else
                  Setting.get('current_issue', '2')
                end

      prefix = Setting.get('doi_prefix', '10.31258')
      pattern = Setting.get('doi_suffix_pattern', 'fastjournal')
      "#{prefix}/#{pattern}.v#{vol_num}i#{iss_num}.#{id || SecureRandom.random_number(1000..9999)}"
    end
  end

  private

  def populate_publication_metadata
    # If assigned to a published issue, force status to 'Published'
    if issue.present? && issue.status == 'published'
      self.status = 'Published'
    end

    if status == 'Published'
      # Populate volume if blank and no associated issue
      if self.read_attribute(:volume).blank? && self.issue_id.nil?
        vol = Setting.get('current_volume', '12')
        write_attribute(:volume, "Vol. #{vol}")
      end

      # Populate issue if blank and no associated issue
      if self.read_attribute(:issue).blank? && self.issue_id.nil?
        iss = Setting.get('current_issue', '2')
        write_attribute(:issue, "Edisi #{iss}")
      end

      # Generate DOI if blank
      if doi.blank?
        article_id = self.id || SecureRandom.random_number(1000..9999)
        
        vol_num = if issue&.volume.present?
                    issue.volume.to_s.gsub(/\D/, '')
                  elsif read_attribute(:volume).present?
                    read_attribute(:volume).to_s.gsub(/\D/, '')
                  else
                    Setting.get('current_volume', '12')
                  end

        iss_num = if issue&.number.present?
                    issue.number.to_s.gsub(/\D/, '')
                  elsif read_attribute(:issue).present?
                    read_attribute(:issue).to_s.gsub(/\D/, '')
                  else
                    Setting.get('current_issue', '2')
                  end

        prefix = Setting.get('doi_prefix', '10.31258')
        pattern = Setting.get('doi_suffix_pattern', 'fastjournal')
        self.doi = "#{prefix}/#{pattern}.v#{vol_num}i#{iss_num}.#{article_id}"
      end

      # Populate published_at if nil
      self.published_at ||= Time.current
    end
  end

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

  def recalculate_issue_pages
    if issue_id.present?
      articles = Article.where(issue_id: issue_id).order(:id)
      articles.each_with_index do |art, index|
        start_p = index * 10 + 1
        end_p = (index + 1) * 10
        art.update_column(:pages, "#{start_p}-#{end_p}")
      end
    end

    old_issue_id = saved_changes['issue_id']&.first
    if old_issue_id.present?
      articles = Article.where(issue_id: old_issue_id).order(:id)
      articles.each_with_index do |art, index|
        start_p = index * 10 + 1
        end_p = (index + 1) * 10
        art.update_column(:pages, "#{start_p}-#{end_p}")
      end
    end
  end
end
