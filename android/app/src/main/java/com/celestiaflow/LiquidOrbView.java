package com.celestiaflow;

import android.animation.ObjectAnimator;
import android.animation.AnimatorSet;
import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.util.AttributeSet;
import android.view.View;

public class LiquidOrbView extends View {
    private Paint paint;
    private Paint glowPaint;
    private int color = 0xFF00B4D8;
    private float rotation = 0;
    private float pulse = 1.0f;
    
    public LiquidOrbView(Context context) {
        super(context);
        init();
    }
    
    public LiquidOrbView(Context context, AttributeSet attrs) {
        super(context, attrs);
        init();
    }
    
    private void init() {
        paint = new Paint(Paint.ANTI_ALIAS_FLAG);
        paint.setStyle(Paint.Style.FILL);
        
        glowPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        glowPaint.setStyle(Paint.Style.FILL);
        glowPaint.setColor(Color.argb(50, 0, 180, 216));
        
        setBackgroundColor(Color.TRANSPARENT);
        
        // Animate rotation
        ObjectAnimator rotateAnim = ObjectAnimator.ofFloat(this, "rotation", 0, 360);
        rotateAnim.setDuration(10000);
        rotateAnim.setRepeatCount(ObjectAnimator.INFINITE);
        rotateAnim.start();
        
        // Animate pulse
        ObjectAnimator pulseX = ObjectAnimator.ofFloat(this, "pulse", 1f, 1.1f, 1f);
        pulseX.setDuration(2000);
        pulseX.setRepeatCount(ObjectAnimator.INFINITE);
        pulseX.start();
    }
    
    public void setRotation(float rotation) {
        this.rotation = rotation;
        invalidate();
    }
    
    public void setPulse(float pulse) {
        this.pulse = pulse;
        invalidate();
    }
    
    public void setLiquidColor(int color) {
        this.color = color;
        paint.setColor(color);
        int r = Color.red(color);
        int g = Color.green(color);
        int b = Color.blue(color);
        glowPaint.setColor(Color.argb(80, r, g, b));
        invalidate();
    }
    
    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        
        float centerX = getWidth() / 2f;
        float centerY = getHeight() / 2f;
        float radius = Math.min(centerX, centerY) * 0.8f * pulse;
        
        // Draw glow
        canvas.drawCircle(centerX, centerY, radius * 1.3f, glowPaint);
        
        // Draw main orb
        paint.setColor(color);
        canvas.drawCircle(centerX, centerY, radius, paint);
        
        // Draw shine effect
        Paint shinePaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        shinePaint.setColor(Color.WHITE);
        shinePaint.setAlpha(100);
        float shineRadius = radius * 0.3f;
        float shineX = centerX - radius * 0.3f;
        float shineY = centerY - radius * 0.3f;
        canvas.drawCircle(shineX, shineY, shineRadius, shinePaint);
    }
}