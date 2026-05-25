package com.celestiaflow;

import android.animation.ObjectAnimator;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.HorizontalScrollView;
import android.widget.LinearLayout;
import android.widget.SeekBar;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class MainActivity extends AppCompatActivity {
    
    private LiquidOrbView liquidOrb;
    private TextView liquidName;
    
    private String currentLiquid = "water";
    private float orbSize = 1.0f;
    private float speed = 0.5f;
    private float glow = 0.5f;
    
    private ArrayList<String> widgets = new ArrayList<>();
    private int gamesPlayed = 0;
    private long startTime;
    private int customizations = 0;
    
    private SharedPreferences prefs;
    
    private final Map<String, String> liquidNames = new HashMap<>();
    private final Map<String, Integer> liquidColors = new HashMap<>();
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        
        prefs = getSharedPreferences("celestiaflow", MODE_PRIVATE);
        loadState();
        
        initLiquidTypes();
        setupUI();
        startTimeTracking();
    }
    
    private void initLiquidTypes() {
        liquidNames.put("water", "Water 💧");
        liquidNames.put("lava", "Lava 🌋");
        liquidNames.put("nebula", "Nebula 🌌");
        liquidNames.put("honey", "Honey 🍯");
        liquidNames.put("aurora", "Aurora 🌈");
        liquidNames.put("crystal", "Crystal 💎");
        liquidNames.put("void", "Void 🕳️");
        liquidNames.put("plasma", "Plasma ⚡");
        
        liquidColors.put("water", 0xFF00B4D8);
        liquidColors.put("lava", 0xFFFF6B35);
        liquidColors.put("nebula", 0xFF9D4EDD);
        liquidColors.put("honey", 0xFFFFBE0B);
        liquidColors.put("aurora", 0xFF06D6A0);
        liquidColors.put("crystal", 0xFF48CAE4);
        liquidColors.put("void", 0xFF1A1A2E);
        liquidColors.put("plasma", 0xFFF72585);
    }
    
    private void setupUI() {
        liquidOrb = findViewById(R.id.liquidOrb);
        liquidName = findViewById(R.id.liquidName);
        
        updateLiquidDisplay();
        
        findViewById(R.id.btnGames).setOnClickListener(v -> showGamesDialog());
        findViewById(R.id.btnWidgets).setOnClickListener(v -> showWidgetsDialog());
        findViewById(R.id.btnStats).setOnClickListener(v -> showStatsDialog());
        findViewById(R.id.btnCustomizeNav).setOnClickListener(v -> showCustomizeDialog());
        findViewById(R.id.btnSurprise).setOnClickListener(v -> randomizeLiquid());
    }
    
    private void updateLiquidDisplay() {
        liquidName.setText(liquidNames.get(currentLiquid));
        liquidOrb.setLiquidColor(liquidColors.get(currentLiquid));
        liquidOrb.setScaleX(orbSize);
        liquidOrb.setScaleY(orbSize);
    }
    
    private void showCustomizeDialog() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("⚙️ Customize");
        
        LinearLayout layout = new LinearLayout(this);
        layout.setOrientation(LinearLayout.VERTICAL);
        layout.setPadding(60, 30, 60, 30);
        
        TextView title1 = new TextView(this);
        title1.setText("💧 Liquid Type");
        title1.setTextSize(18);
        title1.setPadding(0, 20, 0, 15);
        layout.addView(title1);
        
        HorizontalScrollView scroll = new HorizontalScrollView(this);
        LinearLayout liquidRow = new LinearLayout(this);
        liquidRow.setOrientation(LinearLayout.HORIZONTAL);
        
        final Map<Button, String> buttonMap = new HashMap<>();
        
        for (String key : liquidNames.keySet()) {
            Button btn = new Button(this);
            btn.setText(liquidNames.get(key));
            btn.setTextSize(11);
            btn.setWidth(200);
            btn.setHeight(180);
            btn.setAllCaps(false);
            if (currentLiquid.equals(key)) {
                btn.setBackgroundColor(0xFF00B4D8);
            }
            final String liquidKey = key;
            btn.setOnClickListener(v -> {
                selectLiquid(liquidKey);
                Toast.makeText(this, liquidNames.get(liquidKey) + " selected!", Toast.LENGTH_SHORT).show();
            });
            buttonMap.put(btn, key);
            liquidRow.addView(btn);
        }
        scroll.addView(liquidRow);
        layout.addView(scroll);
        
        TextView sizeLabel = new TextView(this);
        sizeLabel.setText("Size: " + String.format("%.1f", orbSize));
        sizeLabel.setTextSize(16);
        sizeLabel.setPadding(0, 30, 0, 10);
        layout.addView(sizeLabel);
        
        SeekBar sizeBar = new SeekBar(this);
        sizeBar.setMax(30);
        sizeBar.setProgress((int)(orbSize * 15));
        final TextView finalSizeLabel = sizeLabel;
        sizeBar.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
            public void onProgressChanged(SeekBar s, int progress, boolean fromUser) {
                orbSize = progress / 15f;
                if (orbSize < 0.1f) orbSize = 0.1f;
                finalSizeLabel.setText("Size: " + String.format("%.1f", orbSize));
                liquidOrb.setScaleX(orbSize);
                liquidOrb.setScaleY(orbSize);
            }
            public void onStartTrackingTouch(SeekBar s) {}
            public void onStopTrackingTouch(SeekBar s) {
                customizations++;
                saveState();
            }
        });
        layout.addView(sizeBar);
        
        TextView speedLabel = new TextView(this);
        speedLabel.setText("Speed: " + String.format("%.1f", speed));
        speedLabel.setTextSize(16);
        speedLabel.setPadding(0, 30, 0, 10);
        layout.addView(speedLabel);
        
        SeekBar speedBar = new SeekBar(this);
        speedBar.setMax(40);
        speedBar.setProgress((int)(speed * 20));
        final TextView finalSpeedLabel = speedLabel;
        speedBar.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
            public void onProgressChanged(SeekBar s, int progress, boolean fromUser) {
                speed = progress / 20f;
                finalSpeedLabel.setText("Speed: " + String.format("%.1f", speed));
            }
            public void onStartTrackingTouch(SeekBar s) {}
            public void onStopTrackingTouch(SeekBar s) {
                customizations++;
                saveState();
            }
        });
        layout.addView(speedBar);
        
        TextView glowLabel = new TextView(this);
        glowLabel.setText("Glow: " + String.format("%.1f", glow));
        glowLabel.setTextSize(16);
        glowLabel.setPadding(0, 30, 0, 10);
        layout.addView(glowLabel);
        
        SeekBar glowBar = new SeekBar(this);
        glowBar.setMax(20);
        glowBar.setProgress((int)(glow * 20));
        final TextView finalGlowLabel = glowLabel;
        glowBar.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
            public void onProgressChanged(SeekBar s, int progress, boolean fromUser) {
                glow = progress / 20f;
                finalGlowLabel.setText("Glow: " + String.format("%.1f", glow));
            }
            public void onStartTrackingTouch(SeekBar s) {}
            public void onStopTrackingTouch(SeekBar s) {
                customizations++;
                saveState();
            }
        });
        layout.addView(glowBar);
        
        Button surpriseBtn = new Button(this);
        surpriseBtn.setText("🎲 Surprise Me");
        surpriseBtn.setOnClickListener(v -> {
            randomizeLiquid();
            Toast.makeText(this, "🎲 New liquid!", Toast.LENGTH_SHORT).show();
        });
        layout.addView(surpriseBtn);
        
        Button resetBtn = new Button(this);
        resetBtn.setText("🔄 Reset");
        resetBtn.setOnClickListener(v -> {
            selectLiquid("water");
            orbSize = 1.0f;
            speed = 0.5f;
            glow = 0.5f;
            saveState();
            Toast.makeText(this, "Reset!", Toast.LENGTH_SHORT).show();
        });
        layout.addView(resetBtn);
        
        builder.setView(layout);
        builder.setNegativeButton("✕", null);
        builder.show();
    }
    
    private void selectLiquid(String liquid) {
        currentLiquid = liquid;
        customizations++;
        updateLiquidDisplay();
        saveState();
    }
    
    private void randomizeLiquid() {
        String[] liquids = {"water", "lava", "nebula", "honey", "aurora", "crystal", "void", "plasma"};
        int random = (int)(Math.random() * liquids.length);
        selectLiquid(liquids[random]);
    }
    
    private void showWidgetsDialog() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("📊 Widgets");
        
        String[] widgetTypes = {"🕐 Clock", "🌤️ Weather", "📝 To-Do", "⏱️ Timer", "🏃 Stopwatch", "📒 Notes", "✅ Habits", "🌙 Moon", "🔋 Battery"};
        boolean[] checked = new boolean[widgetTypes.length];
        
        for (int i = 0; i < widgetTypes.length; i++) {
            if (widgets.contains(widgetTypes[i])) checked[i] = true;
        }
        
        builder.setMultiChoiceItems(widgetTypes, checked, (dialog, which, isChecked) -> {
            if (isChecked && !widgets.contains(widgetTypes[which])) {
                widgets.add(widgetTypes[which]);
                Toast.makeText(this, widgetTypes[which] + " added!", Toast.LENGTH_SHORT).show();
            } else if (!isChecked) {
                widgets.remove(widgetTypes[which]);
                Toast.makeText(this, widgetTypes[which] + " removed", Toast.LENGTH_SHORT).show();
            }
            customizations++;
            saveState();
        });
        
        builder.setPositiveButton("Done", null);
        builder.setNegativeButton("✕", null);
        builder.show();
    }
    
    private void showGamesDialog() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("🎮 Mini Games");
        
        String[] games = {"🫗 Fill It Up", "🫧 Bubble Pop", "🎨 Color Match", "⭕ Orb Merge", "🧘 Zen Flow", "🔮 Bubble Sort"};
        
        builder.setItems(games, (dialog, which) -> {
            gamesPlayed++;
            saveState();
            Toast.makeText(this, games[which] + " started!", Toast.LENGTH_SHORT).show();
        });
        
        builder.setNegativeButton("✕", null);
        builder.show();
    }
    
    private void showStatsDialog() {
        long timeSpent = (System.currentTimeMillis() - startTime) / 1000 + prefs.getLong("timeSpent", 0);
        
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("🏆 Your Stats");
        
        String stats = "⏱️ Time: " + formatTime(timeSpent) + 
                      "\n🎮 Games: " + gamesPlayed + 
                      "\n📊 Widgets: " + widgets.size() + 
                      "\n⚙️ Customizations: " + customizations;
        
        builder.setMessage(stats);
        builder.setPositiveButton("OK", null);
        builder.show();
    }
    
    private String formatTime(long seconds) {
        if (seconds < 60) return seconds + "s";
        if (seconds < 3600) return (seconds / 60) + "m";
        return (seconds / 3600) + "h " + ((seconds % 3600) / 60) + "m";
    }
    
    private void startTimeTracking() {
        startTime = System.currentTimeMillis();
        new Thread(() -> {
            while (true) {
                try {
                    Thread.sleep(60000);
                    saveState();
                } catch (InterruptedException e) {
                    break;
                }
            }
        }).start();
    }
    
    private void saveState() {
        SharedPreferences.Editor editor = prefs.edit();
        editor.putString("liquid", currentLiquid);
        editor.putFloat("orbSize", orbSize);
        editor.putFloat("speed", speed);
        editor.putFloat("glow", glow);
        editor.putInt("gamesPlayed", gamesPlayed);
        editor.putInt("customizations", customizations);
        editor.putLong("timeSpent", (System.currentTimeMillis() - startTime) / 1000);
        editor.apply();
    }
    
    private void loadState() {
        currentLiquid = prefs.getString("liquid", "water");
        orbSize = prefs.getFloat("orbSize", 1.0f);
        speed = prefs.getFloat("speed", 0.5f);
        glow = prefs.getFloat("glow", 0.5f);
        gamesPlayed = prefs.getInt("gamesPlayed", 0);
        customizations = prefs.getInt("customizations", 0);
    }
}