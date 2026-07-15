class Task < ApplicationRecord
  validates :title, presence: true

  enum :category, { daily: 0, weekly: 1, monthly: 2 }

  scope :pending, -> { where(completed: false) }
  scope :done, -> { where(completed: true) }

  def toggle!
    update!(completed: !completed)
  end
end