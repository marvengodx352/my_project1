Rails.application.routes.draw do
  resources :tasks do
    member do
      post :toggle
    end
  end

  root "tasks#index"

  get "up" => "rails/health#show", as: :rails_health_check
end
