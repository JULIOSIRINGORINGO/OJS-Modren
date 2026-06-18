Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    post '/login', to: 'sessions#create'
    post '/register', to: 'users#create'
    get '/profile', to: 'users#show'
    patch '/profile', to: 'users#update'
    resources :users, only: [:index]

    resources :categories, only: [:index, :show]
    resources :articles, only: [:index, :show, :create, :update] do
      member do
        post 'download'
        post 'view'
        post 'upload_file'
        get 'files/:filename', action: :serve_file, as: :serve_file, constraints: { filename: /[^\/]+/ }
      end
    end
    resources :bookmarks, only: [:index, :create, :destroy]
    resources :messages, only: [:index, :create, :show]
    resources :settings, only: [:show, :update], param: :key
    resources :review_assignments, only: [:index, :show, :update]
    resources :issues do
      member do
        post 'publish'
      end
    end

    resources :notifications, only: [:index] do
      member do
        patch 'read', to: 'notifications#mark_read'
      end
      collection do
        get 'unread_count'
        post 'read_all'
      end
    end
  end
end
