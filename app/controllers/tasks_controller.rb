class TasksController < ApplicationController
  before_action :set_task, only: %i[show edit update destroy toggle]

  # GET /tasks
  def index
    @tasks = Task.order(created_at: :desc)

    # Search by title
    if params[:search].present?
      @tasks = @tasks.where("title LIKE ?", "%#{params[:search]}%")
    end

    # Filter by category
    if params[:category].present? && Task.categories.key?(params[:category])
      @tasks = @tasks.where(category: params[:category])
    end

    @active_category = params[:category]
    @search_query = params[:search]
  end

  # GET /tasks/1
  def show
  end

  # GET /tasks/new
  def new
    @task = Task.new
  end

  # POST /tasks
  def create
    @task = Task.new(task_params)

    if @task.save
      redirect_to tasks_path, notice: "Задача успешно создана!"
    else
      render :new, status: :unprocessable_entity
    end
  end

  # GET /tasks/1/edit
  def edit
  end

  # PATCH/PUT /tasks/1
  def update
    if @task.update(task_params)
      redirect_to tasks_path, notice: "Задача обновлена!"
    else
      render :edit, status: :unprocessable_entity
    end
  end

  # POST /tasks/1/toggle
  def toggle
    @task.toggle!
    respond_to do |format|
      format.html { redirect_to tasks_path, notice: "Статус задачи изменён!" }
      format.json { head :ok }
    end
  end

  # DELETE /tasks/1
  def destroy
    @task.destroy
    respond_to do |format|
      format.html { redirect_to tasks_path, notice: "Задача удалена!" }
      format.json { head :ok }
    end
  end

  private

  def set_task
    @task = Task.find(params[:id])
  end

  def task_params
    params.require(:task).permit(:title, :completed, :category, :due_date)
  end
end