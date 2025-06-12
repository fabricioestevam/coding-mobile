import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  StatusBar,
  ScrollView
} from 'react-native';

export default function App() {
  // Estados principais
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [theme, setTheme] = useState('light');
  const [currentTab, setCurrentTab] = useState('all');
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [statsModalVisible, setStatsModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState(null);

  // Estados para dados da API
  const [quotes, setQuotes] = useState([]);
  const [currentQuote, setCurrentQuote] = useState(null);
  const [loadingQuote, setLoadingQuote] = useState(false);

  // Dados para categorias e prioridades
  const categories = [
    { id: 1, name: 'Trabalho', color: '#4A90E2' },
    { id: 2, name: 'Pessoal', color: '#50E3C2' },
    { id: 3, name: 'Saúde', color: '#FF9500' },
    { id: 4, name: 'Compras', color: '#FF6236' },
    { id: 5, name: 'Estudos', color: '#AF52DE' }
  ];

  const priorities = [
    { id: 1, name: 'Baixa', color: '#50E3C2' },
    { id: 2, name: 'Média', color: '#FF9500' },
    { id: 3, name: 'Alta', color: '#FF3B30' }
  ];

  // Cores do tema
  const themes = {
    light: {
      background: '#F5F5F5',
      card: '#FFFFFF',
      text: '#333333',
      accent: '#4A90E2',
      border: '#E5E5E5'
    },
    dark: {
      background: '#121212',
      card: '#1E1E1E',
      text: '#FFFFFF',
      accent: '#4A90E2',
      border: '#333333'
    },
    purple: {
      background: '#F8F0FF',
      card: '#FFFFFF',
      text: '#333333',
      accent: '#9C27B0',
      border: '#E6D2F2'
    },
    green: {
      background: '#E8F5E9',
      card: '#FFFFFF',
      text: '#333333',
      accent: '#43A047',
      border: '#C8E6C9'
    }
  };

  const currentTheme = themes[theme];

  // Gerar ID único
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  // useEffect para carregar dados ao iniciar o app
  useEffect(() => {
    loadTasksFromStorage();
    loadQuotesFromStorage();
    loadSettingsFromStorage();
    
    // Buscar uma citação se não houver nenhuma
    if (quotes.length === 0) {
      fetchInspirationalQuote();
    }
  }, []);

  // useEffect para salvar tarefas sempre que mudarem
  useEffect(() => {
    if (tasks.length > 0) {
      saveTasksToStorage(tasks);
    }
  }, [tasks]);

  // useEffect para salvar tema sempre que mudar
  useEffect(() => {
    saveSettingsToStorage(theme);
  }, [theme]);

  // Função para buscar citação inspiracional da API
  const fetchInspirationalQuote = async () => {
    setLoadingQuote(true);
    try {
      const response = await fetch('https://api.quotable.io/random?tags=inspirational|motivational');
      const data = await response.json();
      const quote = {
        id: data._id,
        content: data.content,
        author: data.author,
        fetchedAt: new Date().toISOString()
      };
      setCurrentQuote(quote);
      
      // Salvar no histórico de citações
      const updatedQuotes = [quote, ...quotes.slice(0, 9)]; // Manter apenas 10 citações
      setQuotes(updatedQuotes);
      await saveQuotesToStorage(updatedQuotes);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível buscar uma citação inspiracional');
      console.error('Erro ao buscar citação:', error);
    } finally {
      setLoadingQuote(false);
    }
  };

  // Substitua essas funções no seu código:

// Função para salvar tarefas (substitua a original)
const saveTasksToStorage = async (tasksToSave) => {
  try {
    // Para web, usar localStorage se disponível, senão só manter em memória
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('fabricio_tasks', JSON.stringify(tasksToSave));
    }
  } catch (error) {
    console.error('Erro ao salvar tarefas:', error);
  }
};

// Função para carregar tarefas (substitua a original)
const loadTasksFromStorage = async () => {
  try {
    let savedTasks = null;
    if (typeof window !== 'undefined' && window.localStorage) {
      savedTasks = localStorage.getItem('fabricio_tasks');
    }
    
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks);
      const tasksWithDates = parsedTasks.map(task => ({
        ...task,
        createdAt: new Date(task.createdAt)
      }));
      setTasks(tasksWithDates);
    }
  } catch (error) {
    console.error('Erro ao carregar tarefas:', error);
  }
};

// Função para salvar citações (substitua a original)
const saveQuotesToStorage = async (quotesToSave) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('fabricio_quotes', JSON.stringify(quotesToSave));
    }
  } catch (error) {
    console.error('Erro ao salvar citações:', error);
  }
};

// Função para carregar citações (substitua a original)
const loadQuotesFromStorage = async () => {
  try {
    let savedQuotes = null;
    if (typeof window !== 'undefined' && window.localStorage) {
      savedQuotes = localStorage.getItem('fabricio_quotes');
    }
    
    if (savedQuotes) {
      const parsedQuotes = JSON.parse(savedQuotes);
      setQuotes(parsedQuotes);
      if (parsedQuotes.length > 0) {
        setCurrentQuote(parsedQuotes[0]);
      }
    }
  } catch (error) {
    console.error('Erro ao carregar citações:', error);
  }
};

// Função para salvar configurações (substitua a original)
const saveSettingsToStorage = async (themeToSave) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('fabricio_theme', themeToSave);
    }
  } catch (error) {
    console.error('Erro ao salvar tema:', error);
  }
};

// Função para carregar configurações (substitua a original)
const loadSettingsFromStorage = async () => {
  try {
    let savedTheme = null;
    if (typeof window !== 'undefined' && window.localStorage) {
      savedTheme = localStorage.getItem('fabricio_theme');
    }
    
    if (savedTheme) {
      setTheme(savedTheme);
    }
  } catch (error) {
    console.error('Erro ao carregar tema:', error);
  }
};

  // Função para adicionar tarefa
  const addTask = async () => {
    if (newTask.trim() === '') {
      Alert.alert('Erro', 'Por favor, digite uma tarefa válida');
      return;
    }

    const task = {
      id: generateId(),
      title: newTask,
      completed: false,
      createdAt: new Date(),
      category: selectedCategory || categories[0],
      priority: selectedPriority || priorities[0],
    };

    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
    await saveTasksToStorage(updatedTasks);
    
    setNewTask('');
    setSelectedCategory(null);
    setSelectedPriority(null);
    setTaskModalVisible(false);
  };

  // Função para marcar tarefa como concluída
  const toggleTaskCompletion = (id) => {
    setTasks(
      tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Função para apagar tarefa
  const deleteTask = (id) => {
    Alert.alert(
      'Confirmação',
      'Tem certeza que deseja excluir esta tarefa?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: () => {
            setTasks(tasks.filter(task => task.id !== id));
          }
        }
      ]
    );
  };

  // Filtragem de tarefas
  const getFilteredTasks = () => {
    let filtered = [...tasks];
    
    if (currentTab === 'complete') {
      filtered = filtered.filter(task => task.completed);
    } else if (currentTab === 'incomplete') {
      filtered = filtered.filter(task => !task.completed);
    }
    
    return filtered;
  };

  // Cálculo de estatísticas
  const getStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const incomplete = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    const categoryStats = categories.map(category => {
      const count = tasks.filter(task => task.category.id === category.id).length;
      return { ...category, count };
    });
    
    const priorityStats = priorities.map(priority => {
      const count = tasks.filter(task => task.priority.id === priority.id).length;
      return { ...priority, count };
    });
    
    return {
      total,
      completed,
      incomplete,
      completionRate,
      categoryStats,
      priorityStats
    };
  };

  // UI para os itens da lista de tarefas
  const renderTaskItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.taskItem,
        { backgroundColor: currentTheme.card, borderColor: currentTheme.border }
      ]}
      onPress={() => toggleTaskCompletion(item.id)}
    >
      <View style={styles.taskHeader}>
        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            style={[
              styles.checkbox,
              item.completed && { backgroundColor: item.category.color }
            ]}
            onPress={() => toggleTaskCompletion(item.id)}
          >
            {item.completed && (
              <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' }}>✓</Text>
            )}
          </TouchableOpacity>
        </View>
        
        <View style={styles.taskContent}>
          <Text
            style={[
              styles.taskTitle,
              { color: currentTheme.text },
              item.completed && styles.completedTask
            ]}
          >
            {item.title}
          </Text>
          
          <View style={styles.taskMeta}>
            <View 
              style={[
                styles.categoryPill,
                { backgroundColor: item.category.color + '30' }
              ]}
            >
              <Text style={[styles.categoryText, { color: item.category.color }]}>
                {item.category.name}
              </Text>
            </View>
            
            <View 
              style={[
                styles.priorityDot,
                { backgroundColor: item.priority.color }
              ]}
            />
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteTask(item.id)}
        >
          <Text style={{ fontSize: 18, color: '#FF3B30' }}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  // UI principal do app
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
        <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
        
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: currentTheme.text }]}>FabricioTask</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity 
              style={[styles.iconButton, { backgroundColor: currentTheme.card }]}
              onPress={() => setFilterModalVisible(true)}
            >
              <Text style={{ fontSize: 18, color: currentTheme.accent }}>🔍</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.iconButton, { backgroundColor: currentTheme.card }]}
              onPress={() => setStatsModalVisible(true)}
            >
              <Text style={{ fontSize: 18, color: currentTheme.accent }}>📊</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.iconButton, { backgroundColor: currentTheme.card }]}
              onPress={() => setSettingsModalVisible(true)}
            >
              <Text style={{ fontSize: 18, color: currentTheme.accent }}>⚙️</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Seção de citação inspiracional */}
        {currentQuote && (
          <View style={[styles.quoteContainer, { backgroundColor: currentTheme.card, borderColor: currentTheme.border }]}>
            <Text style={[styles.quoteText, { color: currentTheme.text }]}>
              "{currentQuote.content}"
            </Text>
            <Text style={[styles.quoteAuthor, { color: currentTheme.accent }]}>
              - {currentQuote.author}
            </Text>
            <TouchableOpacity
              style={[styles.refreshQuoteButton, { backgroundColor: currentTheme.accent + '20' }]}
              onPress={fetchInspirationalQuote}
              disabled={loadingQuote}
            >
              <Text style={[styles.refreshQuoteText, { color: currentTheme.accent }]}>
                {loadingQuote ? '🔄 Buscando...' : '🔄 Nova citação'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Navegação por abas */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              currentTab === 'all' && { 
                backgroundColor: currentTheme.accent,
                borderColor: currentTheme.accent 
              }
            ]}
            onPress={() => setCurrentTab('all')}
          >
            <Text
              style={[
                styles.tabText,
                { color: currentTab === 'all' ? '#FFFFFF' : currentTheme.text }
              ]}
            >
              Todas
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tab,
              currentTab === 'incomplete' && { 
                backgroundColor: currentTheme.accent,
                borderColor: currentTheme.accent 
              }
            ]}
            onPress={() => setCurrentTab('incomplete')}
          >
            <Text
              style={[
                styles.tabText,
                { color: currentTab === 'incomplete' ? '#FFFFFF' : currentTheme.text }
              ]}
            >
              Pendentes
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tab,
              currentTab === 'complete' && { 
                backgroundColor: currentTheme.accent,
                borderColor: currentTheme.accent 
              }
            ]}
            onPress={() => setCurrentTab('complete')}
          >
            <Text
              style={[
                styles.tabText,
                { color: currentTab === 'complete' ? '#FFFFFF' : currentTheme.text }
              ]}
            >
              Concluídas
            </Text>
          </TouchableOpacity>
        </View>

        {/* Lista de tarefas */}
        {tasks.length > 0 ? (
          <FlatList
            data={getFilteredTasks()}
            renderItem={renderTaskItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.list}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: currentTheme.text }]}>
              Nenhuma tarefa adicionada
            </Text>
            <Text style={[styles.emptySubtext, { color: currentTheme.text + '99' }]}>
              Toque no botão "+" para adicionar uma nova tarefa
            </Text>
          </View>
        )}

        {/* Botão de adicionar tarefa */}
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: currentTheme.accent }]}
          onPress={() => setTaskModalVisible(true)}
        >
          <Text style={{ fontSize: 24, color: '#FFFFFF', fontWeight: 'bold' }}>+</Text>
        </TouchableOpacity>

        {/* Modal para adicionar tarefa */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={taskModalVisible}
          onRequestClose={() => setTaskModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalView, { backgroundColor: currentTheme.card }]}>
              <Text style={[styles.modalTitle, { color: currentTheme.text }]}>
                Nova Tarefa
              </Text>
              
              <TextInput
                style={[
                  styles.input,
                  { 
                    backgroundColor: theme === 'dark' ? '#333333' : '#F0F0F0',
                    color: currentTheme.text,
                    borderColor: currentTheme.border
                  }
                ]}
                placeholder="O que precisa ser feito?"
                placeholderTextColor={theme === 'dark' ? '#999999' : '#999999'}
                value={newTask}
                onChangeText={setNewTask}
              />

              <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>
                Categoria
              </Text>
              <ScrollView 
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categorySelector}
              >
                {categories.map(category => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryChip,
                      { 
                        backgroundColor: selectedCategory?.id === category.id 
                          ? category.color 
                          : category.color + '30'
                      }
                    ]}
                    onPress={() => setSelectedCategory(category)}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        { 
                          color: selectedCategory?.id === category.id 
                            ? '#FFFFFF' 
                            : category.color 
                        }
                      ]}
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>
                Prioridade
              </Text>
              <View style={styles.prioritySelector}>
                {priorities.map(priority => (
                  <TouchableOpacity
                    key={priority.id}
                    style={[
                      styles.priorityChip,
                      { 
                        backgroundColor: selectedPriority?.id === priority.id 
                          ? priority.color 
                          : priority.color + '30',
                        borderColor: priority.color
                      }
                    ]}
                    onPress={() => setSelectedPriority(priority)}
                  >
                    <Text
                      style={[
                        styles.priorityChipText,
                        { 
                          color: selectedPriority?.id === priority.id 
                            ? '#FFFFFF' 
                            : priority.color 
                        }
                      ]}
                    >
                      {priority.name}
                    </Text>
                    {priority.id === 3 && <Text style={{ fontSize: 12, color: selectedPriority?.id === priority.id ? '#FFFFFF' : priority.color }}>⭐</Text>}
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    styles.cancelButton,
                    { borderColor: currentTheme.border }
                  ]}
                  onPress={() => {
                    setTaskModalVisible(false);
                    setNewTask('');
                    setSelectedCategory(null);
                    setSelectedPriority(null);
                  }}
                >
                  <Text style={[styles.buttonText, { color: currentTheme.text }]}>
                    Cancelar
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    styles.saveButton,
                    { backgroundColor: currentTheme.accent }
                  ]}
                  onPress={addTask}
                >
                  <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>
                    Adicionar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal de estatísticas */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={statsModalVisible}
          onRequestClose={() => setStatsModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalView, { backgroundColor: currentTheme.card }]}>
              <Text style={[styles.modalTitle, { color: currentTheme.text }]}>
                Estatísticas
              </Text>
              
              <View style={styles.statsContainer}>
                <View style={styles.statBox}>
                  <Text style={[styles.statNumber, { color: currentTheme.text }]}>
                    {getStats().total}
                  </Text>
                  <Text style={[styles.statLabel, { color: currentTheme.text + '99' }]}>
                    Total
                  </Text>
                </View>
                
                <View style={styles.statBox}>
                  <Text style={[styles.statNumber, { color: '#50E3C2' }]}>
                    {getStats().completed}
                  </Text>
                  <Text style={[styles.statLabel, { color: currentTheme.text + '99' }]}>
                    Concluídas
                  </Text>
                </View>
                
                <View style={styles.statBox}>
                  <Text style={[styles.statNumber, { color: '#FF9500' }]}>
                    {getStats().incomplete}
                  </Text>
                  <Text style={[styles.statLabel, { color: currentTheme.text + '99' }]}>
                    Pendentes
                  </Text>
                </View>
              </View>
              
              <View style={styles.progressContainer}>
                <Text style={[styles.progressLabel, { color: currentTheme.text }]}>
                  Taxa de conclusão: {getStats().completionRate}%
                </Text>
                <View style={[styles.progressBar, { backgroundColor: currentTheme.border }]}>
                  <View 
                    style={[
                      styles.progressFill,
                      { 
                        width: `${getStats().completionRate}%`,
                        backgroundColor: currentTheme.accent
                      }
                    ]}
                  />
                </View>
              </View>
              
              <Text style={[styles.sectionTitle, { color: currentTheme.text, marginTop: 16 }]}>
                Por Categoria
              </Text>
              <View style={styles.categoryStat}>
                {getStats().categoryStats.map(cat => (
                  <View key={cat.id} style={styles.categoryStatRow}>
                    <View style={[styles.categoryDot, { backgroundColor: cat.color }]} />
                    <Text style={[styles.categoryStatName, { color: currentTheme.text }]}>
                      {cat.name}
                    </Text>
                    <Text style={[styles.categoryStatCount, { color: currentTheme.text }]}>
                      {cat.count}
                    </Text>
                  </View>
                ))}
              </View>
              
              <Text style={[styles.sectionTitle, { color: currentTheme.text, marginTop: 16 }]}>
                Histórico de Citações
              </Text>
              <ScrollView style={styles.quotesHistory} nestedScrollEnabled={true}>
                {quotes.slice(0, 5).map((quote, index) => (
                  <View key={quote.id} style={[styles.historyQuoteItem, { borderColor: currentTheme.border }]}>
                    <Text style={[styles.historyQuoteText, { color: currentTheme.text }]} numberOfLines={2}>
                      "{quote.content}"
                    </Text>
                    <Text style={[styles.historyQuoteAuthor, { color: currentTheme.accent }]}>
                      - {quote.author}
                    </Text>
                  </View>
                ))}
              </ScrollView>
              
              <TouchableOpacity
                style={[styles.closeButton, { backgroundColor: currentTheme.accent }]}
                onPress={() => setStatsModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal de configurações */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={settingsModalVisible}
          onRequestClose={() => setSettingsModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalView, { backgroundColor: currentTheme.card }]}>
              <Text style={[styles.modalTitle, { color: currentTheme.text }]}>
                Configurações
              </Text>
              
              <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>
                Temas
              </Text>
              
              <View style={styles.themeSelector}>
                <TouchableOpacity
                  style={[
                    styles.themeOption,
                    theme === 'light' && styles.selectedTheme,
                    { borderColor: theme === 'light' ? themes.light.accent : currentTheme.border }
                  ]}
                  onPress={() => setTheme('light')}
                >
                  <View style={[styles.themeColor, { backgroundColor: themes.light.background }]}>
                    <View style={[styles.themeAccent, { backgroundColor: themes.light.accent }]} />
                  </View>
                  <Text style={[styles.themeText, { color: currentTheme.text }]}>Claro</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.themeOption,
                    theme === 'dark' && styles.selectedTheme,
                    { borderColor: theme === 'dark' ? themes.dark.accent : currentTheme.border }
                  ]}
                  onPress={() => setTheme('dark')}
                >
                  <View style={[styles.themeColor, { backgroundColor: themes.dark.background }]}>
                    <View style={[styles.themeAccent, { backgroundColor: themes.dark.accent }]} />
                  </View>
                  <Text style={[styles.themeText, { color: currentTheme.text }]}>Escuro</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.themeOption,
                    theme === 'purple' && styles.selectedTheme,
                    { borderColor: theme === 'purple' ? themes.purple.accent : currentTheme.border }
                  ]}
                  onPress={() => setTheme('purple')}
                >
                  <View style={[styles.themeColor, { backgroundColor: themes.purple.background }]}>
                    <View style={[styles.themeAccent, { backgroundColor: themes.purple.accent }]} />
                  </View>
                  <Text style={[styles.themeText, { color: currentTheme.text }]}>Roxo</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.themeOption,
                    theme === 'green' && styles.selectedTheme,
                    { borderColor: theme === 'green' ? themes.green.accent : currentTheme.border }
                  ]}
                  onPress={() => setTheme('green')}
                >
                  <View style={[styles.themeColor, { backgroundColor: themes.green.background }]}>
                    <View style={[styles.themeAccent, { backgroundColor: themes.green.accent }]} />
                  </View>
                  <Text style={[styles.themeText, { color: currentTheme.text }]}>Verde</Text>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity
                style={[
                  styles.dangerButton,
                  { borderColor: '#FF3B30' }
                ]}
                onPress={() => {
                  Alert.alert(
                    'Limpar tarefas',
                    'Tem certeza que deseja apagar todas as tarefas?',
                    [
                      { text: 'Cancelar', style: 'cancel' },
                      { 
                        text: 'Limpar tudo', 
                        style: 'destructive',
                        onPress: () => {
                          setTasks([]);
                          setSettingsModalVisible(false);
                        }
                      }
                    ]
                  );
                }}
              >
                <Text style={{ color: '#FF3B30' }}>Limpar todas as tarefas</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.closeButton, { backgroundColor: currentTheme.accent }]}
                onPress={() => setSettingsModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  taskItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxContainer: {
    marginRight: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#DDDDDD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  completedTask: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  deleteButton: {
    padding: 8,
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    borderRadius: 16,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  categorySelector: {
    marginBottom: 16,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  categoryChipText: {
    fontWeight: '600',
    fontSize: 14,
  },
  prioritySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  priorityChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    flexDirection: 'row',
    borderWidth: 1,
  },
  priorityChipText: {
    fontWeight: '600',
    fontSize: 14,
    marginRight: 4,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    marginRight: 8,
    borderWidth: 1,
  },
  saveButton: {
    marginLeft: 8,
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 16,
  },
  closeButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  categoryStat: {
    marginBottom: 16,
  },
  categoryStatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  categoryStatName: {
    flex: 1,
    fontSize: 14,
  },
  categoryStatCount: {
    fontSize: 14,
    fontWeight: '600',
  },
  themeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  themeOption: {
    width: '48%',
    marginRight: '4%',
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
  },
  themeOption: {
    width: '48%',
    marginRight: '4%',
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
  },
  selectedTheme: {
    borderWidth: 2,
  },
  themeColor: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeAccent: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  themeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  dangerButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    
  },
  quoteContainer: {
  marginHorizontal: 20,
  marginBottom: 16,
  padding: 16,
  borderRadius: 12,
  borderWidth: 1,
  elevation: 1,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 1,
},
quoteText: {
  fontSize: 16,
  fontStyle: 'italic',
  textAlign: 'center',
  marginBottom: 8,
  lineHeight: 22,
},
quoteAuthor: {
  fontSize: 14,
  fontWeight: '600',
  textAlign: 'center',
  marginBottom: 12,
},
refreshQuoteButton: {
  paddingVertical: 8,
  paddingHorizontal: 16,
  borderRadius: 20,
  alignSelf: 'center',
},
refreshQuoteText: {
  fontSize: 14,
  fontWeight: '600',
},
quotesHistory: {
  maxHeight: 150,
  marginBottom: 16,
},
historyQuoteItem: {
  padding: 12,
  borderBottomWidth: 1,
  marginBottom: 8,
},
historyQuoteText: {
  fontSize: 14,
  marginBottom: 4,
},
historyQuoteAuthor: {
  fontSize: 12,
  fontWeight: '500',
},
});